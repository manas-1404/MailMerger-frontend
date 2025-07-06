export const getJwtTokenFromLocalStorage = (): string => {
    const jwtToken: string | null = localStorage.getItem("jwt_token");

    if (!jwtToken) {
        throw new Error("JWT token not found in local storage");
    }

    return jwtToken;
}