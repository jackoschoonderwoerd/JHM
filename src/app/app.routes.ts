import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { LoginComponent } from './auth/login/login.component';
import { AddStoneComponent } from './admin/add-stone/add-stone.component';
import { StartComponent } from './user/start/start.component';
import { ManageStonesComponent } from './admin/manage-stones/manage-stones.component';

export const routes: Routes = [
    {
        path: '', component: LoginComponent
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component')
            .then(c => c.LoginComponent)
    },
    {
        path: 'add-stone',
        loadComponent: () => import('./admin/add-stone/add-stone.component')
            .then(c => c.AddStoneComponent)
    },
    {
        path: 'start',
        loadComponent: () => import('./user/start/start.component')
            .then(c => c.StartComponent)
    },
    {
        path: 'manage-stones',
        loadComponent: () => import('./admin/manage-stones/manage-stones.component')
            .then(c => c.ManageStonesComponent)
    },
    {
        path: 'simulator',
        loadComponent: () => import('./admin/simulator/simulator.component')
            .then(c => c.SimulatorComponent)
    },
    {
        path: 'admin-login',
        loadComponent: () => import('./auth/admin-login/admin-login.component')
            .then(c => c.AdminLoginComponent)
    },
    {
        path: '**', component: LoginComponent
    }
    // {
    //     path: 'login', component: LoginComponent

    // },
    // {
    //     path: 'add-stone', component: AddStoneComponent

    // },
    // {
    //     path: 'start', component: StartComponent

    // },
    // {
    //     path: 'manage-stones', component: ManageStonesComponent
    // }
];
