import { useState } from 'react';
import { Save, User, Globe, Bell, Shield, CreditCard } from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);

    // Mock settings state
    const [settings, setSettings] = useState({
        siteName: 'Lumina Store',
        supportEmail: 'support@lumina.store',
        currency: 'IDR',
        timezone: 'Asia/Jakarta',
        orderNotifications: true,
        stockNotifications: true,
        marketingEmails: false,
        taxRate: 11,
        shippingFee: 15000
    });

    const handleSave = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            alert('Settings saved successfully!');
        }, 1000);
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Globe },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'store', label: 'Store', icon: CreditCard },
        { id: 'account', label: 'Account', icon: User },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-primary">Settings</h1>
                <p className="text-secondary text-sm">Manage your store preferences and configurations</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Tabs */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                ? 'bg-accent text-white shadow-lg shadow-accent/20'
                                : 'bg-surface border border-white/5 text-secondary hover:text-primary hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={18} />
                            <span className="font-medium">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-surface border border-white/5 rounded-2xl p-6 lg:p-8">
                    {activeTab === 'general' && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-xl font-bold text-primary mb-6">General Settings</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-secondary mb-2">Store Name</label>
                                    <input
                                        type="text"
                                        value={settings.siteName}
                                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-primary focus:outline-none focus:border-accent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-secondary mb-2">Support Email</label>
                                    <input
                                        type="email"
                                        value={settings.supportEmail}
                                        onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-primary focus:outline-none focus:border-accent"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-secondary mb-2">Currency</label>
                                        <select
                                            value={settings.currency}
                                            onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-primary focus:outline-none focus:border-accent"
                                        >
                                            <option value="IDR">IDR (Rp)</option>
                                            <option value="USD">USD ($)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-secondary mb-2">Timezone</label>
                                        <select
                                            value={settings.timezone}
                                            onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                            className="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-primary focus:outline-none focus:border-accent"
                                        >
                                            <option value="Asia/Jakarta">Asia/Jakarta (GMT+7)</option>
                                            <option value="UTC">UTC</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-xl font-bold text-primary mb-6">Notification Preferences</h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-white/5">
                                    <div>
                                        <h3 className="font-medium text-primary">Order Notifications</h3>
                                        <p className="text-xs text-secondary">Receive alerts for new orders</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.orderNotifications}
                                            onChange={(e) => setSettings({ ...settings, orderNotifications: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-white/5">
                                    <div>
                                        <h3 className="font-medium text-primary">Low Stock Alerts</h3>
                                        <p className="text-xs text-secondary">Notify when product stock is low</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.stockNotifications}
                                            onChange={(e) => setSettings({ ...settings, stockNotifications: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'store' && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-xl font-bold text-primary mb-6">Store Configuration</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-secondary mb-2">Default Tax Rate (%)</label>
                                    <input
                                        type="number"
                                        value={settings.taxRate}
                                        onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) })}
                                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-primary focus:outline-none focus:border-accent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-secondary mb-2">Flat Shipping Rate (Rp)</label>
                                    <input
                                        type="number"
                                        value={settings.shippingFee}
                                        onChange={(e) => setSettings({ ...settings, shippingFee: parseFloat(e.target.value) })}
                                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-primary focus:outline-none focus:border-accent"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'account' && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-xl font-bold text-primary mb-6">Account Settings</h2>

                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500 text-sm mb-6">
                                Some account settings are managed via Supabase Auth.
                            </div>

                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-primary transition-colors flex items-center justify-center gap-2">
                                <Shield size={18} />
                                Change Password
                            </button>
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center gap-2 font-bold"
                        >
                            <Save size={20} />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
