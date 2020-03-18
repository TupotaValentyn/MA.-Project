export default interface UserPublicData {
    id: number,
    name: string,
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPublicData,
        }
    }
}
