type onboardingSwiperDataType = {
    id: number;
    title: string;
    description: string;
    sortDescription: string;
    image: any;
}

type User = {
    id: any,
    userName: any,
    email: any,
    isEmailActive: any,
    dislayName: any,
    password?: any,
    role: any,
    avatarUrl?: any,
    streamInfo: {
        last_stream: any,
        stream_token: any,
        status: any
}
}

type InfoUser = {
    id: string,
    userName: string,
    email: string,
    dislayName: string,
    role: string,
    avatarUrl?: string,
}

type Follow = {
    id: String,
    followed: {
        user_id: String,
        user_display_name: String,
        user_avatar: String
    },
    follower: {
        user_id: String,
        user_display_name: String,
        user_avatar: String
    },
    followDate: Date
}