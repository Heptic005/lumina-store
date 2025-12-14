// Script to clear all old data and start fresh
// Run this in browser console (F12)

console.log('🧹 Clearing old data...');

// 1. Clear localStorage (cart data)
localStorage.clear();
console.log('✅ localStorage cleared (cart reset)');

// 2. Reload page
console.log('🔄 Reloading page...');
window.location.reload();
