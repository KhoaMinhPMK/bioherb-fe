import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    farmService,
    plotService,
    cropCycleService,
    taskPlanService,
    taskLogService,
    workerService,
    equipmentService,
    inputItemService,
    harvestService,
    cooperativeService,
} from '../services/entityServices';

const DataContext = createContext(null);

// ─── Normalizers (backend → frontend shape) ───────────────────

function toStr(v) {
    return v != null ? String(v) : null;
}

const normalizeFarm = (f) => ({
    ...f,
    id: toStr(f.id),
    htxId: toStr(f.cooperativeId ?? f.htxId),
    managerId: toStr(f.managerUserId ?? f.managerId),
});

const normalizePlot = (p) => ({
    ...p,
    id: toStr(p.id),
    farmId: toStr(p.farmId),
    area: p.areaHa != null ? `${p.areaHa} ha` : '—',
    crop: p.defaultCropName || '—',
    activeCycle: p.activeCycle || null,
    status: p.status || 'active',
    coords: p.coordsText || '',
});

const normalizeCropCycle = (c) => ({
    ...c,
    id: toStr(c.id),
    plotId: toStr(c.plotId),
    cropId: toStr(c.cropId),
});

const normalizeTaskPlan = (t) => ({
    ...t,
    id: toStr(t.id),
    cropCycleId: toStr(t.cropCycleId),
});

const normalizeTaskLog = (t) => ({
    ...t,
    id: toStr(t.id),
    cropCycleId: toStr(t.cropCycleId),
    taskPlanId: toStr(t.taskPlanId),
});

const normalizeWorker = (w) => ({ ...w, id: toStr(w.id), farmId: toStr(w.farmId) });
const normalizeEquipment = (e) => ({ ...e, id: toStr(e.id), farmId: toStr(e.farmId) });
const normalizeInputItem = (i) => ({ ...i, id: toStr(i.id), farmId: toStr(i.farmId) });
const normalizeHarvestBatch = (h) => ({ ...h, id: toStr(h.id), cropCycleId: toStr(h.cropCycleId) });
const normalizeCooperative = (c) => ({ ...c, id: toStr(c.id) });

// ─── Helpers: frontend form → backend DTO ────────────────────

function genCode(name, prefix = '') {
    const slug = (name || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]/g, '')
        .toUpperCase()
        .slice(0, 8);
    return `${prefix}${slug}${Date.now() % 10000}`;
}

const toFarmDto = (d) => ({
    name: d.name,
    code: d.code || genCode(d.name, 'F'),
    address: d.address || '',
    cooperativeId: parseInt(d.cooperativeId || d.htxId) || undefined,
    managerUserId: parseInt(d.managerUserId || d.managerId) || undefined,
    status: d.status,
    timeMode: d.timeMode || 'hour',
    workdayHours: d.workdayHours ? parseFloat(d.workdayHours) : 8,
});

const toPlotDto = (d) => {
    const rawArea = String(d.areaHa || d.area || '').replace(/[^0-9.]/g, '');
    return {
        name: d.name,
        code: d.code || genCode(d.name, 'P'),
        farmId: parseInt(d.farmId) || undefined,
        areaHa: rawArea ? parseFloat(rawArea) : undefined,
        defaultCropName: d.defaultCropName || d.crop || undefined,
        coordsText: d.coordsText || d.coords || undefined,
        status: d.status,
    };
};

const toCropCycleDto = (d) => ({
    plotId: parseInt(d.plotId) || undefined,
    code: d.code || genCode(d.name || 'MV', 'CC'),
    startDate: d.startDate,
    endDate: d.endDate || undefined,
    expectedHarvestDate: d.expectedHarvestDate || undefined,
    status: d.status || 'active',
    notes: d.notes || undefined,
    cropId: parseInt(d.cropId) || undefined,
});

const toTaskPlanDto = (d) => ({
    cropCycleId: parseInt(d.cropCycleId) || undefined,
    taskTypeId: parseInt(d.taskTypeId) || undefined,
    plannedDate: d.plannedDate || d.date,
    notes: d.notes || undefined,
    status: d.status || 'pending',
});

const toTaskLogDto = (d) => ({
    cropCycleId: parseInt(d.cropCycleId) || undefined,
    taskTypeId: parseInt(d.taskTypeId) || undefined,
    taskPlanId: parseInt(d.taskPlanId) || undefined,
    workDate: d.workDate || d.date,
    notes: d.notes || undefined,
    status: d.status || 'draft',
    timeMode: d.timeMode || 'hour',
    hourQty: d.hourQty ? parseFloat(d.hourQty) : undefined,
    workdayQty: d.workdayQty ? parseFloat(d.workdayQty) : undefined,
});

const toWorkerDto = (d) => ({
    farmId: parseInt(d.farmId) || undefined,
    name: d.name,
    phone: d.phone || undefined,
    role: d.role || undefined,
    dailyWage: d.dailyWage ? parseFloat(d.dailyWage) : undefined,
    status: d.status || 'active',
});

const toEquipmentDto = (d) => ({
    farmId: parseInt(d.farmId) || undefined,
    name: d.name,
    type: d.type || undefined,
    status: d.status || 'active',
    hoursPerDay: d.hoursPerDay ? parseFloat(d.hoursPerDay) : undefined,
    fuelCostPerHour: d.fuelCostPerHour ? parseFloat(d.fuelCostPerHour) : undefined,
});

const toInputItemDto = (d) => ({
    farmId: parseInt(d.farmId) || undefined,
    name: d.name,
    category: d.category || undefined,
    unit: d.unit || undefined,
    unitPrice: d.unitPrice ? parseFloat(d.unitPrice) : undefined,
    status: d.status || 'active',
});

const toHarvestDto = (d) => ({
    cropCycleId: parseInt(d.cropCycleId) || undefined,
    harvestDate: d.harvestDate || d.date,
    weightKg: d.weightKg ? parseFloat(d.weightKg) : undefined,
    grade: d.grade || undefined,
    notes: d.notes || undefined,
});

const toCooperativeDto = (d) => ({
    name: d.name,
    code: d.code || genCode(d.name, 'HTX'),
    province: d.province || undefined,
    address: d.address || undefined,
    directorName: d.directorName || undefined,
    phone: d.phone || undefined,
    email: d.email || undefined,
    status: d.status || 'active',
});

// ─── Provider ────────────────────────────────────────────────

export function DataProvider({ children }) {
    // === API-backed state ===
    const [farms, setFarms] = useState([]);
    const [plots, setPlots] = useState([]);
    const [cropCycles, setCropCycles] = useState([]);
    const [taskPlans, setTaskPlans] = useState([]);
    const [taskLogs, setTaskLogs] = useState([]);
    const [workersList, setWorkersList] = useState([]);
    const [equipmentList, setEquipmentList] = useState([]);
    const [inputItems, setInputItems] = useState([]);
    const [harvestBatches, setHarvestBatches] = useState([]);
    const [cooperatives, setCooperatives] = useState([]);
    const [usersList] = useState([]);

    // === Mock-backed state (no backend module yet — start empty, add API later) ===
    const [attendanceData, setAttendanceData] = useState([]);
    const [pestIncidents, setPestIncidents] = useState([]);
    const [notificationsList, setNotificationsList] = useState([]);
    const [gacpEntries, setGacpEntries] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);

    // === Fetch all API entities ===
    const fetchAll = useCallback(async () => {
        setIsLoading(true);
        try {
            const [
                farmsRes,
                plotsRes,
                cyclesRes,
                plansRes,
                logsRes,
                workersRes,
                equipRes,
                inputsRes,
                harvestRes,
                coopsRes,
            ] = await Promise.allSettled([
                farmService.getAll(),
                plotService.getAll(),
                cropCycleService.getAll(),
                taskPlanService.getAll(),
                taskLogService.getAll(),
                workerService.getAll(),
                equipmentService.getAll(),
                inputItemService.getAll(),
                harvestService.getAll(),
                cooperativeService.getAll(),
            ]);

            const ok = (res) => (res.status === 'fulfilled' ? (res.value?.data?.data ?? []) : []);

            const rawCycles = ok(cyclesRes).map(normalizeCropCycle);
            const activeCycleMap = {};
            rawCycles.forEach((c) => {
                if (c.status === 'active' && c.plotId) activeCycleMap[c.plotId] = c.code || c.id;
            });

            setFarms(ok(farmsRes).map(normalizeFarm));
            setPlots(
                ok(plotsRes).map((p) => normalizePlot({ ...p, activeCycle: activeCycleMap[String(p.id)] || null })),
            );
            setCropCycles(rawCycles);
            setTaskPlans(ok(plansRes).map(normalizeTaskPlan));
            setTaskLogs(ok(logsRes).map(normalizeTaskLog));
            setWorkersList(ok(workersRes).map(normalizeWorker));
            setEquipmentList(ok(equipRes).map(normalizeEquipment));
            setInputItems(ok(inputsRes).map(normalizeInputItem));
            setHarvestBatches(ok(harvestRes).map(normalizeHarvestBatch));
            setCooperatives(ok(coopsRes).map(normalizeCooperative));
            setInitialized(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // === Listen for auth events ===
    useEffect(() => {
        const onLogin = () => fetchAll();
        const onLogout = () => {
            setFarms([]);
            setPlots([]);
            setCropCycles([]);
            setTaskPlans([]);
            setTaskLogs([]);
            setWorkersList([]);
            setEquipmentList([]);
            setInputItems([]);
            setHarvestBatches([]);
            setCooperatives([]);
            setInitialized(false);
        };
        window.addEventListener('sankit:login', onLogin);
        window.addEventListener('sankit:logout', onLogout);
        return () => {
            window.removeEventListener('sankit:login', onLogin);
            window.removeEventListener('sankit:logout', onLogout);
        };
    }, [fetchAll]);

    // === Generic API CRUD helpers ===
    const apiMutate = useCallback(async (fn, setter, normalizer) => {
        setIsLoading(true);
        try {
            const { data } = await fn();
            const normalized = normalizer(data);
            if (setter) {
                setter((prev) => {
                    const idx = prev.findIndex((item) => item.id === normalized.id);
                    return idx >= 0 ? prev.map((item, i) => (i === idx ? normalized : item)) : [...prev, normalized];
                });
            }
            return normalized;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const apiDelete = useCallback(async (fn, setter, id) => {
        setIsLoading(true);
        try {
            await fn();
            if (setter) setter((prev) => prev.filter((item) => item.id !== String(id)));
            return true;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // === Farm CRUD ===
    const addFarm = useCallback(
        (d) => apiMutate(() => farmService.create(toFarmDto(d)), setFarms, normalizeFarm),
        [apiMutate],
    );
    const updateFarm = useCallback(
        (id, d) => apiMutate(() => farmService.update(parseInt(id), toFarmDto(d)), setFarms, normalizeFarm),
        [apiMutate],
    );
    const deleteFarm = useCallback(
        (id) => apiDelete(() => farmService.delete(parseInt(id)), setFarms, id),
        [apiDelete],
    );

    // === Plot CRUD ===
    const addPlot = useCallback(
        (d) => apiMutate(() => plotService.create(toPlotDto(d)), setPlots, normalizePlot),
        [apiMutate],
    );
    const updatePlot = useCallback(
        (id, d) => apiMutate(() => plotService.update(parseInt(id), toPlotDto(d)), setPlots, normalizePlot),
        [apiMutate],
    );
    const deletePlot = useCallback(
        (id) => apiDelete(() => plotService.delete(parseInt(id)), setPlots, id),
        [apiDelete],
    );

    // === Crop Cycle CRUD ===
    const addCropCycle = useCallback(
        (d) => apiMutate(() => cropCycleService.create(toCropCycleDto(d)), setCropCycles, normalizeCropCycle),
        [apiMutate],
    );
    const updateCropCycle = useCallback(
        (id, d) =>
            apiMutate(
                () => cropCycleService.update(parseInt(id), toCropCycleDto(d)),
                setCropCycles,
                normalizeCropCycle,
            ),
        [apiMutate],
    );
    const deleteCropCycle = useCallback(
        (id) => apiDelete(() => cropCycleService.delete(parseInt(id)), setCropCycles, id),
        [apiDelete],
    );

    // === Task Plan CRUD ===
    const addTaskPlan = useCallback(
        (d) => apiMutate(() => taskPlanService.create(toTaskPlanDto(d)), setTaskPlans, normalizeTaskPlan),
        [apiMutate],
    );
    const updateTaskPlan = useCallback(
        (id, d) =>
            apiMutate(() => taskPlanService.update(parseInt(id), toTaskPlanDto(d)), setTaskPlans, normalizeTaskPlan),
        [apiMutate],
    );
    const deleteTaskPlan = useCallback(
        (id) => apiDelete(() => taskPlanService.delete(parseInt(id)), setTaskPlans, id),
        [apiDelete],
    );

    // === Task Log CRUD ===
    const addTaskLog = useCallback(
        (d) => apiMutate(() => taskLogService.create(toTaskLogDto(d)), setTaskLogs, normalizeTaskLog),
        [apiMutate],
    );
    const updateTaskLog = useCallback(
        (id, d) => apiMutate(() => taskLogService.update(parseInt(id), toTaskLogDto(d)), setTaskLogs, normalizeTaskLog),
        [apiMutate],
    );
    const deleteTaskLog = useCallback(
        (id) => apiDelete(() => taskLogService.delete(parseInt(id)), setTaskLogs, id),
        [apiDelete],
    );
    const approveTaskLog = useCallback(
        (id) => apiMutate(() => taskLogService.approve(parseInt(id)), setTaskLogs, normalizeTaskLog),
        [apiMutate],
    );
    const rejectTaskLog = useCallback(
        (id) => apiMutate(() => taskLogService.reject(parseInt(id)), setTaskLogs, normalizeTaskLog),
        [apiMutate],
    );

    // === Worker CRUD ===
    const addWorker = useCallback(
        (d) => apiMutate(() => workerService.create(toWorkerDto(d)), setWorkersList, normalizeWorker),
        [apiMutate],
    );
    const updateWorker = useCallback(
        (id, d) => apiMutate(() => workerService.update(parseInt(id), toWorkerDto(d)), setWorkersList, normalizeWorker),
        [apiMutate],
    );
    const deleteWorker = useCallback(
        (id) => apiDelete(() => workerService.delete(parseInt(id)), setWorkersList, id),
        [apiDelete],
    );

    // === Equipment CRUD ===
    const addEquipment = useCallback(
        (d) => apiMutate(() => equipmentService.create(toEquipmentDto(d)), setEquipmentList, normalizeEquipment),
        [apiMutate],
    );
    const updateEquipment = useCallback(
        (id, d) =>
            apiMutate(
                () => equipmentService.update(parseInt(id), toEquipmentDto(d)),
                setEquipmentList,
                normalizeEquipment,
            ),
        [apiMutate],
    );
    const deleteEquipment = useCallback(
        (id) => apiDelete(() => equipmentService.delete(parseInt(id)), setEquipmentList, id),
        [apiDelete],
    );

    // === Input Item CRUD ===
    const addInputItem = useCallback(
        (d) => apiMutate(() => inputItemService.create(toInputItemDto(d)), setInputItems, normalizeInputItem),
        [apiMutate],
    );
    const updateInputItem = useCallback(
        (id, d) =>
            apiMutate(
                () => inputItemService.update(parseInt(id), toInputItemDto(d)),
                setInputItems,
                normalizeInputItem,
            ),
        [apiMutate],
    );
    const deleteInputItem = useCallback(
        (id) => apiDelete(() => inputItemService.delete(parseInt(id)), setInputItems, id),
        [apiDelete],
    );

    // === Harvest CRUD ===
    const addHarvestBatch = useCallback(
        (d) => apiMutate(() => harvestService.create(toHarvestDto(d)), setHarvestBatches, normalizeHarvestBatch),
        [apiMutate],
    );
    const updateHarvestBatch = useCallback(
        (id, d) =>
            apiMutate(
                () => harvestService.update(parseInt(id), toHarvestDto(d)),
                setHarvestBatches,
                normalizeHarvestBatch,
            ),
        [apiMutate],
    );
    const deleteHarvestBatch = useCallback(
        (id) => apiDelete(() => harvestService.delete(parseInt(id)), setHarvestBatches, id),
        [apiDelete],
    );

    // === Cooperative CRUD ===
    const addCooperative = useCallback(
        (d) => apiMutate(() => cooperativeService.create(toCooperativeDto(d)), setCooperatives, normalizeCooperative),
        [apiMutate],
    );
    const updateCooperative = useCallback(
        (id, d) =>
            apiMutate(
                () => cooperativeService.update(parseInt(id), toCooperativeDto(d)),
                setCooperatives,
                normalizeCooperative,
            ),
        [apiMutate],
    );
    const deleteCooperative = useCallback(
        (id) => apiDelete(() => cooperativeService.delete(parseInt(id)), setCooperatives, id),
        [apiDelete],
    );

    // === Mock CRUD helpers ===
    const withLoadingMock = useCallback(async (fn) => {
        setIsLoading(true);
        return new Promise((resolve) =>
            setTimeout(() => {
                const r = fn();
                setIsLoading(false);
                resolve(r);
            }, 200),
        );
    }, []);

    const addAttendance = useCallback(
        (e) => withLoadingMock(() => setAttendanceData((prev) => [...prev, e])),
        [withLoadingMock],
    );
    const updateAttendance = useCallback(
        (id, u) =>
            withLoadingMock(() => setAttendanceData((prev) => prev.map((a) => (a.id === id ? { ...a, ...u } : a)))),
        [withLoadingMock],
    );
    const addPestIncident = useCallback(
        (i) => withLoadingMock(() => setPestIncidents((prev) => [...prev, i])),
        [withLoadingMock],
    );
    const updatePestIncident = useCallback(
        (id, u) =>
            withLoadingMock(() => setPestIncidents((prev) => prev.map((p) => (p.id === id ? { ...p, ...u } : p)))),
        [withLoadingMock],
    );
    const deletePestIncident = useCallback(
        (id) => withLoadingMock(() => setPestIncidents((prev) => prev.filter((p) => p.id !== id))),
        [withLoadingMock],
    );
    const addGacpEntry = useCallback(
        (e) => withLoadingMock(() => setGacpEntries((prev) => [...prev, e])),
        [withLoadingMock],
    );
    const updateGacpEntry = useCallback(
        (id, u) => withLoadingMock(() => setGacpEntries((prev) => prev.map((g) => (g.id === id ? { ...g, ...u } : g)))),
        [withLoadingMock],
    );
    const deleteGacpEntry = useCallback(
        (id) => withLoadingMock(() => setGacpEntries((prev) => prev.filter((g) => g.id !== id))),
        [withLoadingMock],
    );

    // === Notifications ===
    const markNotificationRead = useCallback(
        (id) => setNotificationsList((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n))),
        [],
    );
    const markAllNotificationsRead = useCallback(
        () => setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true }))),
        [],
    );
    const unreadNotifCount = useMemo(() => notificationsList.filter((n) => !n.read).length, [notificationsList]);

    // === Computed helpers ===
    const getPlotsByFarm = useCallback((farmId) => plots.filter((p) => p.farmId === String(farmId)), [plots]);
    const getFarmsByHtx = useCallback((htxId) => farms.filter((f) => f.htxId === String(htxId)), [farms]);
    const getLogsByPlot = useCallback(
        (plotId) => {
            const cycleIds = new Set(cropCycles.filter((c) => c.plotId === String(plotId)).map((c) => c.id));
            return taskLogs.filter((l) => cycleIds.has(l.cropCycleId));
        },
        [taskLogs, cropCycles],
    );
    const getCyclesByPlot = useCallback(
        (plotId) => cropCycles.filter((c) => c.plotId === String(plotId)),
        [cropCycles],
    );
    const getPestByPlot = useCallback(
        (plotId) => pestIncidents.filter((p) => p.plotId === String(plotId)),
        [pestIncidents],
    );
    const getAttendanceByFarm = useCallback(
        (farmId) => attendanceData.filter((a) => a.farmId === String(farmId)),
        [attendanceData],
    );
    const getAttendanceByDate = useCallback((date) => attendanceData.filter((a) => a.date === date), [attendanceData]);
    const getGacpByPlot = useCallback(
        (plotId) => gacpEntries.filter((e) => e.plotId === String(plotId)),
        [gacpEntries],
    );
    const getGacpByType = useCallback((type) => gacpEntries.filter((e) => e.type === type), [gacpEntries]);

    // === Value ===
    const value = useMemo(
        () => ({
            farms,
            plots,
            cropCycles,
            taskPlans,
            taskLogs,
            attendanceData,
            pestIncidents,
            inputItems,
            workers: workersList,
            equipment: equipmentList,
            harvestBatches,
            notifications: notificationsList,
            users: usersList,
            cooperatives,
            activityLog: [],
            gacpEntries,
            isLoading,
            initialized,
            fetchAll,
            addFarm,
            updateFarm,
            deleteFarm,
            addPlot,
            updatePlot,
            deletePlot,
            addCropCycle,
            updateCropCycle,
            deleteCropCycle,
            addTaskPlan,
            updateTaskPlan,
            deleteTaskPlan,
            addTaskLog,
            updateTaskLog,
            deleteTaskLog,
            approveTaskLog,
            rejectTaskLog,
            updateAttendance,
            addAttendance,
            addPestIncident,
            updatePestIncident,
            deletePestIncident,
            addInputItem,
            updateInputItem,
            deleteInputItem,
            addWorker,
            updateWorker,
            deleteWorker,
            addEquipment,
            updateEquipment,
            deleteEquipment,
            addHarvestBatch,
            updateHarvestBatch,
            deleteHarvestBatch,
            addCooperative,
            updateCooperative,
            deleteCooperative,
            markNotificationRead,
            markAllNotificationsRead,
            unreadNotifCount,
            addUser: () => Promise.resolve(),
            updateUser: () => Promise.resolve(),
            deleteUser: () => Promise.resolve(),
            addGacpEntry,
            updateGacpEntry,
            deleteGacpEntry,
            getPlotsByFarm,
            getFarmsByHtx,
            getLogsByPlot,
            getCyclesByPlot,
            getPestByPlot,
            getAttendanceByFarm,
            getAttendanceByDate,
            getGacpByPlot,
            getGacpByType,
        }),
        [
            farms,
            plots,
            cropCycles,
            taskPlans,
            taskLogs,
            attendanceData,
            pestIncidents,
            inputItems,
            workersList,
            equipmentList,
            harvestBatches,
            notificationsList,
            usersList,
            cooperatives,
            gacpEntries,
            isLoading,
            initialized,
            fetchAll,
            addFarm,
            updateFarm,
            deleteFarm,
            addPlot,
            updatePlot,
            deletePlot,
            addCropCycle,
            updateCropCycle,
            deleteCropCycle,
            addTaskPlan,
            updateTaskPlan,
            deleteTaskPlan,
            addTaskLog,
            updateTaskLog,
            deleteTaskLog,
            approveTaskLog,
            rejectTaskLog,
            updateAttendance,
            addAttendance,
            addPestIncident,
            updatePestIncident,
            deletePestIncident,
            addInputItem,
            updateInputItem,
            deleteInputItem,
            addWorker,
            updateWorker,
            deleteWorker,
            addEquipment,
            updateEquipment,
            deleteEquipment,
            addHarvestBatch,
            updateHarvestBatch,
            deleteHarvestBatch,
            addCooperative,
            updateCooperative,
            deleteCooperative,
            markNotificationRead,
            markAllNotificationsRead,
            unreadNotifCount,
            addGacpEntry,
            updateGacpEntry,
            deleteGacpEntry,
            getPlotsByFarm,
            getFarmsByHtx,
            getLogsByPlot,
            getCyclesByPlot,
            getPestByPlot,
            getAttendanceByFarm,
            getAttendanceByDate,
            getGacpByPlot,
            getGacpByType,
        ],
    );

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

DataProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}

export default DataContext;
