import { faBuilding, faChartLine, faFileInvoiceDollar, faHouse, IconDefinition, } from "@fortawesome/free-solid-svg-icons";

export interface Menu {
    path: string;
    title: string;
    icon: IconDefinition;
}

const DASHBOARD: Menu = {
    path: 'dashboard',
    title: 'Dashboard',
    icon: faChartLine
}

const ACCOUNTING: Menu = {
    path: 'accounting',
    title: 'Accounting',
    icon: faFileInvoiceDollar
}

const CONDO: Menu = {
    path: 'condo',
    title: 'Condo',
    icon: faBuilding
}

const HOME: Menu = {
    path: 'home',
    title: 'Home',
    icon: faHouse
}

export const MENU_LIST = [
    DASHBOARD, ACCOUNTING, CONDO, HOME
];