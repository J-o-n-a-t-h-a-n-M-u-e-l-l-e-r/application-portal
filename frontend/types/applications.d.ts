interface Application {
    id: number
    subject: string
    description: string
    status: string
    created_at: string
    updated_at: string
    student: Student
    files: Document[]
    comments: ApplicationComment[]
}

interface Document {
    id: number
    name: string
    created_at: string
    updated_at: string
    file: string
    application: number
}

interface ApplicationList {
    count: number
    next: string | null
    previous: string | null
    results: Application[]
}

interface ApplicationsPageMap {
    [key: number]: number[]
}

interface ApplicationMap {
    [key: number]: Application
}

type RegisterUser = {
    id: number
    first_name: string
    last_name: string
    email: string
    username: string
    student?: RegisterStudent
    staff?: RegisterStaff
}

type RegisterStudent = {
    user_id?: number
    first_name: string
    last_name: string
    email: string
    phone: string
    address: string
    birth_date: string
    current_degree: string
    created_at: string
    updated_at: string
}

type RegisterStaff = {
    user_id?: number
    first_name: string
    last_name: string
    email: string
    birth_date: string
    position: string
    department: string
    created_at: string
    updated_at: string
}

type User = {
    id: number
    first_name: string
    last_name: string
    email: string
    username: string
    student_profile?: Student
    staff_profile?: Staff
}

type Student = {
    user_id: number
    first_name: string
    last_name: string
    email: string
    phone: string
    address: string
    birth_date: string
    current_degree: string
    created_at: string
    updated_at: string
}

type Staff = {
    user_id: number
    first_name: string
    last_name: string
    email: string
    birth_date: string
    position: string
    department: string
    created_at: string
    updated_at: string
}

interface ApplicationComment {
    id: number
    text: string
    created_at: string
    updated_at: string
    created_by: Staff
}

interface Navigator {
    connection: {
        downlink: number
        effectiveType: string
        rtt: number
        saveData: boolean
    }
}
