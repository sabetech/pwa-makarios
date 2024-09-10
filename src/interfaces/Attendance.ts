export interface IAttendanceRequestInfo {
    date: string;
    event: string;
    service_type: 'academic';
}

export type IAttendanceResponseInfo = {
    event: string;
    date: string;
    time: string;
    student_id: number;
}