import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    users as initialUsers,
    cooperatives as initialCooperatives,
    farms as initialFarms,
    plots as initialPlots,
    cropCycles as initialCropCycles,
    taskPlans as initialTaskPlans,
    taskLogs as initialTaskLogs,
    attendance as initialAttendance,
    pestIncidents as initialPestIncidents,
    inputItems as initialInputItems,
    workers as initialWorkers,
    equipment as initialEquipment,
    harvestBatches as initialHarvestBatches,
    notifications as initialNotifications,
    activityLog as initialActivityLog,
} from '../data/mockData';
import { gacpEntries as initialGacpEntries } from '../data/gacpMockData';

const DataContext = createContext(null);

/**
 * DataProvider — Central state management for all mock data.
 * Provides CRUD + loading simulation for every entity.
 * All pages read from here; mutations update state in-place.
 */
export function DataProvider({ children }) {
    // === STATE ===
    const [farms, setFarms] = useState(initialFarms);
    const [plots, setPlots] = useState(initialPlots);
    const [cropCycles, setCropCycles] = useState(initialCropCycles);
    const [taskPlans, setTaskPlans] = useState(initialTaskPlans);
    const [taskLogs, setTaskLogs] = useState(initialTaskLogs);
    const [attendanceData, setAttendanceData] = useState(initialAttendance);
    const [pestIncidents, setPestIncidents] = useState(initialPestIncidents);
    const [inputItems, setInputItems] = useState(initialInputItems);
    const [workersList, setWorkersList] = useState(initialWorkers);
    const [equipmentList, setEquipmentList] = useState(initialEquipment);
    const [harvestBatches, setHarvestBatches] = useState(initialHarvestBatches);
    const [notificationsList, setNotificationsList] = useState(initialNotifications);
    const [usersList, setUsersList] = useState(initialUsers);
    const [cooperatives, setCooperatives] = useState(initialCooperatives);
    const [gacpEntries, setGacpEntries] = useState(initialGacpEntries);
    const [isLoading, setIsLoading] = useState(false);

    // === LOADING SIMULATION ===
    const withLoading = useCallback(async (fn) => {
        setIsLoading(true);
        return new Promise((resolve) => {
            setTimeout(() => {
                const result = fn();
                setIsLoading(false);
                resolve(result);
            }, 500);
        });
    }, []);

    // === GENERIC CRUD HELPERS ===
    const addItem = useCallback(
        (setter, item) => {
            return withLoading(() => {
                setter((prev) => [...prev, item]);
                return item;
            });
        },
        [withLoading],
    );

    const updateItem = useCallback(
        (setter, id, updates) => {
            return withLoading(() => {
                setter((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
                return true;
            });
        },
        [withLoading],
    );

    const deleteItem = useCallback(
        (setter, id) => {
            return withLoading(() => {
                setter((prev) => prev.filter((item) => item.id !== id));
                return true;
            });
        },
        [withLoading],
    );

    // === FARM CRUD ===
    const addFarm = useCallback((farm) => addItem(setFarms, farm), [addItem]);
    const updateFarm = useCallback((id, updates) => updateItem(setFarms, id, updates), [updateItem]);
    const deleteFarm = useCallback((id) => deleteItem(setFarms, id), [deleteItem]);

    // === PLOT CRUD ===
    const addPlot = useCallback((plot) => addItem(setPlots, plot), [addItem]);
    const updatePlot = useCallback((id, updates) => updateItem(setPlots, id, updates), [updateItem]);
    const deletePlot = useCallback((id) => deleteItem(setPlots, id), [deleteItem]);

    // === CROP CYCLE CRUD ===
    const addCropCycle = useCallback((cycle) => addItem(setCropCycles, cycle), [addItem]);
    const updateCropCycle = useCallback((id, updates) => updateItem(setCropCycles, id, updates), [updateItem]);
    const deleteCropCycle = useCallback((id) => deleteItem(setCropCycles, id), [deleteItem]);

    // === TASK PLAN CRUD ===
    const addTaskPlan = useCallback((plan) => addItem(setTaskPlans, plan), [addItem]);
    const updateTaskPlan = useCallback((id, updates) => updateItem(setTaskPlans, id, updates), [updateItem]);
    const deleteTaskPlan = useCallback((id) => deleteItem(setTaskPlans, id), [deleteItem]);

    // === TASK LOG CRUD ===
    const addTaskLog = useCallback((log) => addItem(setTaskLogs, log), [addItem]);
    const updateTaskLog = useCallback((id, updates) => updateItem(setTaskLogs, id, updates), [updateItem]);
    const deleteTaskLog = useCallback((id) => deleteItem(setTaskLogs, id), [deleteItem]);
    const approveTaskLog = useCallback((id) => updateItem(setTaskLogs, id, { status: 'approved' }), [updateItem]);
    const rejectTaskLog = useCallback((id) => updateItem(setTaskLogs, id, { status: 'rejected' }), [updateItem]);

    // === ATTENDANCE ===
    const updateAttendance = useCallback((id, updates) => updateItem(setAttendanceData, id, updates), [updateItem]);
    const addAttendance = useCallback((entry) => addItem(setAttendanceData, entry), [addItem]);

    // === PEST INCIDENT CRUD ===
    const addPestIncident = useCallback((incident) => addItem(setPestIncidents, incident), [addItem]);
    const updatePestIncident = useCallback((id, updates) => updateItem(setPestIncidents, id, updates), [updateItem]);
    const deletePestIncident = useCallback((id) => deleteItem(setPestIncidents, id), [deleteItem]);

    // === INPUT ITEM CRUD ===
    const addInputItem = useCallback((item) => addItem(setInputItems, item), [addItem]);
    const updateInputItem = useCallback((id, updates) => updateItem(setInputItems, id, updates), [updateItem]);
    const deleteInputItem = useCallback((id) => deleteItem(setInputItems, id), [deleteItem]);

    // === WORKER CRUD ===
    const addWorker = useCallback((worker) => addItem(setWorkersList, worker), [addItem]);
    const updateWorker = useCallback((id, updates) => updateItem(setWorkersList, id, updates), [updateItem]);
    const deleteWorker = useCallback((id) => deleteItem(setWorkersList, id), [deleteItem]);

    // === EQUIPMENT CRUD ===
    const addEquipment = useCallback((eq) => addItem(setEquipmentList, eq), [addItem]);
    const updateEquipment = useCallback((id, updates) => updateItem(setEquipmentList, id, updates), [updateItem]);
    const deleteEquipment = useCallback((id) => deleteItem(setEquipmentList, id), [deleteItem]);

    // === HARVEST CRUD ===
    const addHarvestBatch = useCallback((batch) => addItem(setHarvestBatches, batch), [addItem]);
    const updateHarvestBatch = useCallback((id, updates) => updateItem(setHarvestBatches, id, updates), [updateItem]);
    const deleteHarvestBatch = useCallback((id) => deleteItem(setHarvestBatches, id), [deleteItem]);

    // === NOTIFICATIONS ===
    const markNotificationRead = useCallback(
        (id) => updateItem(setNotificationsList, id, { read: true }),
        [updateItem],
    );
    const markAllNotificationsRead = useCallback(() => {
        setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
    }, []);
    const unreadNotifCount = useMemo(() => notificationsList.filter((n) => !n.read).length, [notificationsList]);

    // === USER MANAGEMENT (Admin) ===
    const addUser = useCallback((user) => addItem(setUsersList, user), [addItem]);
    const updateUser = useCallback((id, updates) => updateItem(setUsersList, id, updates), [updateItem]);
    const deleteUser = useCallback((id) => deleteItem(setUsersList, id), [deleteItem]);

    // === COOPERATIVE CRUD ===
    const addCooperative = useCallback((coop) => addItem(setCooperatives, coop), [addItem]);
    const updateCooperative = useCallback((id, updates) => updateItem(setCooperatives, id, updates), [updateItem]);
    const deleteCooperative = useCallback((id) => deleteItem(setCooperatives, id), [deleteItem]);

    // === GACP DIARY CRUD ===
    const addGacpEntry = useCallback((entry) => addItem(setGacpEntries, entry), [addItem]);
    const updateGacpEntry = useCallback((id, updates) => updateItem(setGacpEntries, id, updates), [updateItem]);
    const deleteGacpEntry = useCallback((id) => deleteItem(setGacpEntries, id), [deleteItem]);

    // === COMPUTED HELPERS ===
    const getPlotsByFarm = useCallback((farmId) => plots.filter((p) => p.farmId === farmId), [plots]);
    const getFarmsByHtx = useCallback((htxId) => farms.filter((f) => f.htxId === htxId), [farms]);
    const getLogsByPlot = useCallback((plotId) => taskLogs.filter((l) => l.plotId === plotId), [taskLogs]);
    const getCyclesByPlot = useCallback((plotId) => cropCycles.filter((c) => c.plotId === plotId), [cropCycles]);
    const getPestByPlot = useCallback((plotId) => pestIncidents.filter((p) => p.plotId === plotId), [pestIncidents]);
    const getAttendanceByFarm = useCallback(
        (farmId) => attendanceData.filter((a) => a.farmId === farmId),
        [attendanceData],
    );
    const getAttendanceByDate = useCallback((date) => attendanceData.filter((a) => a.date === date), [attendanceData]);
    const getGacpByPlot = useCallback((plotId) => gacpEntries.filter((e) => e.plotId === plotId), [gacpEntries]);
    const getGacpByType = useCallback((type) => gacpEntries.filter((e) => e.type === type), [gacpEntries]);

    const value = useMemo(
        () => ({
            // Data
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
            activityLog: initialActivityLog,
            gacpEntries,
            isLoading,
            // Farm CRUD
            addFarm,
            updateFarm,
            deleteFarm,
            // Plot CRUD
            addPlot,
            updatePlot,
            deletePlot,
            // Crop Cycle CRUD
            addCropCycle,
            updateCropCycle,
            deleteCropCycle,
            // Task Plan CRUD
            addTaskPlan,
            updateTaskPlan,
            deleteTaskPlan,
            // Task Log CRUD
            addTaskLog,
            updateTaskLog,
            deleteTaskLog,
            approveTaskLog,
            rejectTaskLog,
            // Attendance
            updateAttendance,
            addAttendance,
            // Pest Incident CRUD
            addPestIncident,
            updatePestIncident,
            deletePestIncident,
            // Input Item CRUD
            addInputItem,
            updateInputItem,
            deleteInputItem,
            // Worker CRUD
            addWorker,
            updateWorker,
            deleteWorker,
            // Equipment CRUD
            addEquipment,
            updateEquipment,
            deleteEquipment,
            // Harvest CRUD
            addHarvestBatch,
            updateHarvestBatch,
            deleteHarvestBatch,
            // Notifications
            markNotificationRead,
            markAllNotificationsRead,
            unreadNotifCount,
            // User Management
            addUser,
            updateUser,
            deleteUser,
            // Cooperative CRUD
            addCooperative,
            updateCooperative,
            deleteCooperative,
            // GACP Diary CRUD
            addGacpEntry,
            updateGacpEntry,
            deleteGacpEntry,
            // Helpers
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
            markNotificationRead,
            markAllNotificationsRead,
            unreadNotifCount,
            addUser,
            updateUser,
            deleteUser,
            addCooperative,
            updateCooperative,
            deleteCooperative,
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
