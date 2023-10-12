import { promises as fs } from 'node:fs';
import path from 'node:path';
import skills from './skills.js';
import type {
  GetViewerRepositoryLanguagesQuery,
  GetViewerRepositoryLanguagesQueryVariables,
} from './generated/github-types.js';

export interface LanguageSizeData {
  readonly name: string;
  readonly size: number;
  readonly color: string;
}

export interface GitHubData {
  readonly total: number;
  readonly languages: readonly LanguageSizeData[];
}

const getGitHubPaginatedData = async (
  token: string,
): Promise<
  GetViewerRepositoryLanguagesQuery['viewer']['repositories']['nodes']
> => {
  let nextPageCursor: string;
  let results: GetViewerRepositoryLanguagesQuery['viewer']['repositories']['nodes'] =
    [];
  const query = await fs.readFile(
    new URL('viewer-repository-languages.query.graphql', import.meta.url),
    'utf-8',
  );
  do {
    const variables: GetViewerRepositoryLanguagesQueryVariables = {
      nextPageCursor,
    };
    const request = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const response = (await request.json()) as {
      data: GetViewerRepositoryLanguagesQuery;
    };
    results = results.concat(
      response.data.viewer.repositories.nodes.filter(
        (node) => node.collaborators,
      ),
    );
    nextPageCursor = response.data.viewer.repositories.pageInfo.endCursor;
  } while (nextPageCursor);

  return results;
};

const getGitHubData = async (token: string): Promise<GitHubData> => {
  const data = await getGitHubPaginatedData(token);

  const { total, languages } = data.reduce<{
    total: number;
    languages: Record<string, { color: string; size: number }>;
  }>(
    (acc, repo) => ({
      ...acc,
      total: (acc.total || 0) + repo.languages.totalSize,
      languages: {
        ...acc.languages,
        ...repo.languages.edges.reduce<
          Record<string, { color: string; size: number }>
        >(
          (languages, language) => ({
            ...languages,
            [language.node.name]: {
              ...acc.languages[language.node.name],
              color: language.node.color,
              size:
                acc.languages[language.node.name]?.size || 0 + language.size,
            },
          }),
          {},
        ),
      },
    }),
    { total: 0, languages: {} },
  );

  return {
    total,
    languages: Object.entries(languages).reduce<LanguageSizeData[]>(
      (languageArr, [name, { color, size }]) => {
        const index = languageArr.findIndex((language) => language.size < size);
        const newElemIndex = index < 0 ? languageArr.length : index;
        const firstSlice = languageArr.slice(0, newElemIndex);
        const secondSlice = languageArr.slice(newElemIndex);

        return [
          ...firstSlice,
          {
            name,
            size,
            color:
              color ||
              skills.coding[name]?.color ||
              'var(--theme-card-background)',
          },
          ...secondSlice,
        ];
      },
      [],
    ),
  };
};

export interface GetGitHubCodeStatsOptions {
  readonly token?: string;
  readonly cache?: boolean;
  readonly cachePath?: string;
}

const getGitHubCodeStats = async ({
  token = process.env.GH_TOKEN,
  cache,
  cachePath = './.cache/github-code-stats.json',
}: GetGitHubCodeStatsOptions = {}): Promise<GitHubData> => {
  let data: GitHubData | undefined;

  if (cache) {
    try {
      const content = await fs.readFile(cachePath, 'utf-8');
      data = JSON.parse(content);
    } catch {}
  }

  if (!data) {
    data = await getGitHubData(token);
    if (cache) {
      try {
        await fs.mkdir(path.dirname(cachePath), { recursive: true });
        await fs.writeFile(cachePath, JSON.stringify(data));
      } catch {}
    }
  }

  return data;
};

export default getGitHubCodeStats;
