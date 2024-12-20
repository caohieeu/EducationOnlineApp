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

type UserSignup = {
    userName: string;
    email: string;
    dislayName: string;
    password: string;
    role: string;
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

interface VideoUpload {
    title: string,
    description: string,
    image_url: string,
    video_size: string,
    video_status: string,
    file_type: string,
    tags: string[]
}

interface VideoUploadCourse {
    title: string,
    description: string,
    image_url: string,
    video_size: number,
    status: number,
    file_type: string,
    tags: string[]
}

interface VideoSingle {
    id: string,
    user: {
        user_id: string,
        user_name: string,
        user_avatar: string
    }
    time: Date
    title: string,
    description: string,
    view: number,
    like: number,
    thumbnail: string,
    status: string,
    statusNum: number,
    videoUrl: string,
    fileType: string,
    tags: string[],
    isLike: boolean,
    isSub: boolean
}

interface VideoCourse {
    id: string,
    time: Date
    title: string,
    description: string,
    view: number,
    like: number,
    thumbnail: string,
    status: string,
    statusNum: number,
    videoUrl: string,
    fileType: string,
    tags: string[]
}

type BannerDataTypes = {
    bannerImageUrl: any;
};

interface CourseUpload {
    title: string,
    desc: string,
    courseDetail: string,
    courseImage: string,
    price: number,
    tags: string[],
    discount: number
}

interface Course {
    _id: string,
    title: string,
    desc: string,
    courseDetail: string,
    courseImage: string,
    price: number,
    tags: [],
    discount: 10,
    cuser: {
      user_id: string,
      user_name: string,
      user_avatar: string
    },
    cdate: Date,
    edate: Date,
    students: [
      {
        rate: number,
        user_id: string,
        user_name: string,
        user_avatar: string
      }
    ],
    videos: VideoSingle[]
  }

 type PaginationState = {
    pageSize: number;
    page: number;
    total_pages?: number;
    total_rows?: number;
  };

interface Chat {
    _id: string,
    content: string,
    room_id: string,
    userAvatar: string,
    userId: string,
    userName: string
}

interface PaginationResponse<Data> extends PaginationState {
    data: Data;
}

interface Comment {
    id: string,
    cDate: Date,
    content: string,
    subUser: {
      user_id: string,
      user_name: string,
      user_avatar: string
    },
    like: number,
    dislike: number,
    module: string,
    moduleId: string
  }

interface FormJoinRoomRequestModel {
    cmd: string;
    roomKey: string;
}

interface RoomRequestModel {
    user_id: string;
    user_name: string;
    user_avatar: string;
    room_id: string;
    res?: boolean;
    roomId?: string;
    roomType: number;
  }

interface RemoveFromRoomMOdel{
    roomId : string;
    userId : string;
    cmd : string;
  }

interface UpdateUserModel {
    id: string,
    email: string,
    dislayName: string,
    avatarUrl: string
}

interface RoomOwner {
    user_id: string;
    user_name: string;
    user_avatar: string;
}

interface Attendee {
    user_id: string;
    user_name: string;
    user_avatar: string;
}

interface RoomModel {
    streamUrl: string;
    streamKey: string;
    room: {
        _id: string;
        roomKey: string;
        roomTitle: string;
        roomThumbnail: string;
        status: number;
        mode: number;
        cDate: string;
        owner: RoomOwner;
        attendees: Attendee[];
        videoUrl: string;
        roomType: number;
    };
}

interface SendMessageModel {
    userId: string,
    userName: string,
    userAvatar: string,
    content: string,
    room_id: string
}