export const getJwtTokenFromLocalStorage = (): string => {
    const jwtToken: string | null = localStorage.getItem("jwt_token");

    if (!jwtToken) {
        throw new Error("JWT token not found in local storage");
    }

    return jwtToken;
}

export const getRefreshTokenFromLocalStorage = (): string => {
    const refreshToken: string | null = localStorage.getItem("refresh_token");

    if (!refreshToken) {
        throw new Error("Refresh token not found in local storage");
    }

    return refreshToken;
}

export function isJwtExpired(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const tokenExpiry = payload.exp;
        const nowTime: number = Math.floor(Date.now() / 1000);

        return nowTime >= tokenExpiry;
    } catch (e) {
        return true;
    }
}

export function isRefreshTokenExpired(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const tokenExpiry = payload.exp;
        const nowTime: number = Math.floor(Date.now() / 1000);

        return nowTime >= tokenExpiry;
    } catch (e) {
        return true;
    }
}
