import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
// Lazy-loaded pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const FarmList = lazy(() => import('./pages/Farm/FarmList'));
const PlotList = lazy(() => import('./pages/Plot/PlotList'));
const PlotDetail = lazy(() => import('./pages/Plot/PlotDetail'));
const CropCycleList = lazy(() => import('./pages/CropCycle/CropCycleList'));
const CropCycleDetail = lazy(() => import('./pages/CropCycle/CropCycleDetail'));
const TaskPlanList = lazy(() => import('./pages/TaskPlan/TaskPlanList'));
const TaskLogList = lazy(() => import('./pages/TaskLog/TaskLogList'));
const TaskLogForm = lazy(() => import('./pages/TaskLog/TaskLogForm'));
const InputItemList = lazy(() => import('./pages/InputItem/InputItemList'));
const ResourceList = lazy(() => import('./pages/Resource/ResourceList'));
const PestIncidentList = lazy(() => import('./pages/PestIncident/PestIncidentList'));
const HarvestList = lazy(() => import('./pages/Harvest/HarvestList'));
const QRTrace = lazy(() => import('./pages/QRTrace/QRTrace'));
const ReportPage = lazy(() => import('./pages/Report/ReportPage'));
const AdminUsers = lazy(() => import('./pages/Admin/AdminUsers'));
const LoadingFallback = () => (<div className="loading-fallback">
        <div className="loading-spinner"/>
    </div>);
function Routers() {
    return (<Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Public Route */}
                <Route path="/login" element={<Login />}/>
                <Route path="/qr/:lotCode" element={<QRTrace />}/>

                {/* Protected Routes with Layout */}
                <Route path="/*" element={<MainLayout>
                        <Suspense fallback={<LoadingFallback />}>
                            <Routes>
                                <Route path="/" element={<Dashboard />}/>
                                <Route path="/farms" element={<FarmList />}/>
                                <Route path="/plots" element={<PlotList />}/>
                                <Route path="/plots/:id" element={<PlotDetail />}/>
                                <Route path="/crop-cycles" element={<CropCycleList />}/>
                                <Route path="/crop-cycles/:id" element={<CropCycleDetail />}/>
                                <Route path="/task-plans" element={<TaskPlanList />}/>
                                <Route path="/task-logs" element={<TaskLogList />}/>
                                <Route path="/task-logs/new" element={<TaskLogForm />}/>
                                <Route path="/task-logs/:id/edit" element={<TaskLogForm />}/>
                                <Route path="/input-items" element={<InputItemList />}/>
                                <Route path="/resources" element={<ResourceList />}/>
                                <Route path="/pest-incidents" element={<PestIncidentList />}/>
                                <Route path="/harvests" element={<HarvestList />}/>
                                <Route path="/qr" element={<QRTrace />}/>
                                <Route path="/reports" element={<ReportPage />}/>
                                <Route path="/admin/users" element={<AdminUsers />}/>
                            </Routes>
                        </Suspense>
                    </MainLayout>}/>
            </Routes>
        </Suspense>);
}
export default Routers;
