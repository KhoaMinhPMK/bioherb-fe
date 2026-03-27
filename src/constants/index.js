/**
 * SANKIT Domain Constants
 * Tập trung tất cả status, type, role, severity, shift constants
 * để tránh hardcode string rải rác trong codebase.
 */

// --- Entity Status ---
export const ENTITY_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    CLOSED: 'closed',
    DRAFT: 'draft',
};

// --- Plot Status ---
export const PLOT_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PEST_ALERT: 'pest_alert',
};

// --- Crop Cycle Status ---
export const CROP_CYCLE_STATUS = {
    PLANNING: 'planning',
    ACTIVE: 'active',
    HARVESTING: 'harvesting',
    COMPLETED: 'completed',
    CANCELED: 'canceled',
};

// --- Task Log / Journal Status ---
export const TASK_LOG_STATUS = {
    DRAFT: 'draft',
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    RETURNED: 'returned',
};

// --- Harvest Status ---
export const HARVEST_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    DONE: 'done',
};

// --- Pest Incident Status ---
export const PEST_STATUS = {
    MONITORING: 'monitoring',
    RESOLVED: 'resolved',
    CLOSED: 'closed',
};

// --- Pest Severity ---
export const PEST_SEVERITY = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low',
};

/** @type {Record<string, string>} */
export const PEST_SEVERITY_LABEL = {
    [PEST_SEVERITY.HIGH]: 'Nặng',
    [PEST_SEVERITY.MEDIUM]: 'Trung bình',
    [PEST_SEVERITY.LOW]: 'Nhẹ',
};

/** @type {Record<string, string>} */
export const PEST_SEVERITY_VARIANT = {
    [PEST_SEVERITY.HIGH]: 'error',
    [PEST_SEVERITY.MEDIUM]: 'warning',
    [PEST_SEVERITY.LOW]: 'info',
};

// --- Task Plan Status ---
export const TASK_PLAN_STATUS = {
    BACKLOG: 'backlog',
    TODO: 'todo',
    IN_PROGRESS: 'in_progress',
    DONE: 'done',
    CANCELED: 'canceled',
};

// --- Journal Types ---
export const JOURNAL_TYPE = {
    SEED: 'seed',
    FERTILIZER: 'fertilizer',
    PEST: 'pest',
    FARMING: 'farming',
    HARVEST: 'harvest',
    PROCESSING: 'processing',
};

// --- Shift ---
export const SHIFT = {
    MORNING: 'morning',
    AFTERNOON: 'afternoon',
    EVENING: 'evening',
};

/** @type {Record<string, string>} */
export const SHIFT_LABEL = {
    [SHIFT.MORNING]: 'Sáng',
    [SHIFT.AFTERNOON]: 'Trưa',
    [SHIFT.EVENING]: 'Chiều',
};

// --- Cooperative Status ---
export const COOPERATIVE_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
};

// --- Lot / Batch Status ---
export const LOT_STATUS = {
    PACKED: 'packed',
    PENDING: 'pending',
};

// --- Warehouse Transaction Type ---
export const WAREHOUSE_TX_TYPE = {
    IN: 'in',
    OUT: 'out',
};

// --- User Status ---
export const USER_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
};

// --- Roles ---
export const USER_ROLE = {
    ADMIN: 'admin',
    HTX_MANAGER: 'htx_manager',
    FARM_MANAGER: 'farm_manager',
    APPROVER: 'approver',
    WORKER: 'worker',
    VIEWER: 'viewer',
};

// --- Stock Level ---
export const STOCK_LEVEL = {
    LOW: 'low',
    SUFFICIENT: 'sufficient',
};

// --- Task Plan Deviation Type ---
export const DEVIATION_TYPE = {
    MAJOR: 'major',
    MINOR: 'minor',
    UNPLANNED: 'unplanned',
};

// --- Calendar Event Type ---
export const CALENDAR_EVENT_TYPE = {
    PLAN: 'plan',
    LOG: 'log',
};

// --- Permission Actions ---
export const PERMISSION_ACTION = {
    VIEW: 'view',
    CREATE: 'create',
    EDIT: 'edit',
    DELETE: 'delete',
    APPROVE: 'approve',
};

// --- Attendance / Worker Log Status ---
export const ATTENDANCE_STATUS = {
    FULL: 'full',
    APPROVED: 'approved',
};
