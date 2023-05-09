export interface RepoInterface {
    repoName: string,
    repoURL: string,
    repoLanguage: string
}

export interface ErrorInterface {
    isError: boolean,
    errorCode: number,
    errorMessage: string
}
