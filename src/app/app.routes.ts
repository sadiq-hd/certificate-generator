import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'مصمم الشهادات - الصفحة الرئيسية'
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'contact',
    component: ContactComponent,
    title: 'تواصل معنا - مصمم الشهادات'
  },
  
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];