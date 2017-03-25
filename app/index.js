import component from './component';
import './main.css';
// import 'purecss';
// import 'font-awesome/css/font-awesome.css';
import 'react';

var oSpan = document.createElement('span');
oSpan.innerHTML = 'span';

document.body.appendChild(oSpan);

document.body.appendChild(component());