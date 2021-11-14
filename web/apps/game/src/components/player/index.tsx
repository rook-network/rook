import Card from '../card'

export type LoginProps = {
    callbackFn: (password: string) => void
}

export const LoginCard = (props: LoginProps) => {
    return (
        <Card>
            <h2 style={{marginTop: "20vh"}}>Login</h2>
        </Card>
    )
}

export type CreateProps = {
    mainAddress: string
    callbackFn: (playerAddress: string) => void
}

export const CreateCard = (props: CreateProps) => {
    return (
        <Card>
            <h2 style={{marginTop: "20vh"}}>Create</h2>
        </Card>
    )
}