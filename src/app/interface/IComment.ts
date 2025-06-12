export interface Comment {
    id:          number;
    description: string;
    state:       boolean;
    movie_id:    number;
    user_id:     number;
    user:        User;
}

export interface User {
    id:    number;
    user:  string;
    email: string;
}
