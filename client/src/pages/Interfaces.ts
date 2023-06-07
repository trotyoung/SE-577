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

export interface GistInterface {
    fileName: string,
    fileLanguage: string,
    fileSize: number
}

export interface UserInterface {
    userName: string,
    userLocation: string,
    userAvatarURL: string
    userPublicRepos: number,
    userFollowers: number
}
