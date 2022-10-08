import skills from './skills';

export interface LanguageSizeData {
  readonly name: string;
  readonly size: number;
  readonly color: string;
}

export interface GitHubData {
  readonly total: number;
  readonly languages: readonly LanguageSizeData[];
}

const getGitHubPaginatedData = async (token: string) => {
  let nextPageCursor: string;
  let results = [];
  do {
    const request = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          query {
            viewer {
              repositories(first: 100${
                nextPageCursor ? `, after: "${nextPageCursor}"` : ''
              }) {
                nodes {
                  languages(first: 100) {
                    edges {
                      node {
                        name
                      }
                      size
                    }
                    totalSize
                  }
                }
                pageInfo {
        					endCursor
      					}
              }
            }
          }
        `,
      }),
    });

    const response = await request.json();
    results = results.concat(response.data.viewer.repositories.nodes);
    nextPageCursor = response.data.viewer.repositories.pageInfo.endCursor;
  } while (nextPageCursor);

  return results;
};

const getGitHubCodeStats = async (
  token = process.env.GH_TOKEN,
): Promise<GitHubData> => {
  const data = await getGitHubPaginatedData(token);

  const { total, languages } = data.reduce(
    (acc: any, repo: any) => ({
      ...acc,
      total: (acc.total || 0) + repo.languages.totalSize,
      languages: {
        ...acc.languages,
        ...repo.languages.edges.reduce(
          (languages: any, language: any) => ({
            ...languages,
            [language.node.name]: {
              ...acc.languages[language.node.name],
              color: language.node.color,
              size:
                ((acc.languages[language.node.name] || {}).size || 0) +
                language.size,
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
    languages: Object.entries(languages).reduce(
      (languageArr: any, [name, { color, size }]: [string, any]) => {
        const index = languageArr.findIndex(
          (language: any) => language.size < size,
        );
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

export default getGitHubCodeStats;
