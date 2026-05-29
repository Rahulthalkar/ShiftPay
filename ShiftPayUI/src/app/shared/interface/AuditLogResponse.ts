export interface AuditLogResponse {
    id: number;
    entityName: string;
    entityId: string;
    actionType: string;
    originalValue: string | null;
    newValue: string;
    changedBy: string;
    timestamp: string;
}

export interface AttendanceDetails {
    UserId: number;
    Date: string;
    StartTime: string;
    EndTime: string;
    ShiftType: number;
    Salary: number;
    Status: boolean;
    ApporveById: number | null;
    Latitude: number | null;
    Longitude: number | null;
    ClockInTime: string | null;
    ClockOutTime: string | null;
}

export interface Activity {
    id: number;

    user: {
        name: string;
        role: string;
        avatar?: string;
        initial: string;
    };

    action: string;
    entity: string;
    timestamp: string;

    status: 'SUCCESS' | 'PROCESSING' | 'FLAGGED';

    details: AttendanceDetails;
}