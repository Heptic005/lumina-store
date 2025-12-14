import { useState, useEffect } from 'react';
import {
    DollarSign,
    ShoppingBag,
    Users,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { supabase } from '../../lib/supabaseClient';

const Dashboard = () => {
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        customers: 0,
        growth: 12.5
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);


    const [salesData, setSalesData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Orders for Revenue & Sales Chart
                const { data: orders, error: ordersError } = await supabase
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (ordersError) throw ordersError;

                // Fetch Order Items for Best Selling
                const { data: orderItems, error: itemsError } = await supabase
                    .from('order_items')
                    .select(`
                        product_id,
                        quantity,
                        products (
                            name
                        )
                    `);

                if (itemsError) throw itemsError;

                // --- Calculate Stats ---
                const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
                const totalOrders = orders.length;
                const uniqueCustomers = new Set(orders.map(o => o.user_id)).size;

                setStats({
                    revenue: totalRevenue,
                    orders: totalOrders,
                    customers: uniqueCustomers,
                    growth: 12.5 // Metric calculation could be more complex
                });

                // --- Process Sales Data (Last 7 Days) ---
                const last7Days = [...Array(7)].map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    return d.toISOString().split('T')[0];
                }).reverse();

                const salesMap = {};
                last7Days.forEach(date => salesMap[date] = 0);

                orders.forEach(order => {
                    const date = new Date(order.created_at).toISOString().split('T')[0];
                    if (salesMap.hasOwnProperty(date)) {
                        salesMap[date] += (order.total || 0);
                    }
                });

                const formattedSalesData = last7Days.map(date => ({
                    name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                    sales: salesMap[date]
                }));
                setSalesData(formattedSalesData);


                // --- Process Best Selling Products ---
                const productSales = {};
                orderItems.forEach(item => {
                    const name = item.products?.name || 'Unknown Product';
                    if (!productSales[name]) {
                        productSales[name] = 0;
                    }
                    productSales[name] += item.quantity;
                });

                const sortedProducts = Object.entries(productSales)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5) // Top 5
                    .map(([name, quantity]) => ({ name, quantity }));

                setTopProducts(sortedProducts);

                setRecentOrders(orders.slice(0, 5));
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const StatCard = ({ title, value, icon: Icon, trend }) => (
        <div className="bg-surface border border-white/5 p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-accent/10 rounded-xl text-accent">
                    <Icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {trend >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {Math.abs(trend)}%
                </div>
            </div>
            <h3 className="text-secondary text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-primary">{value}</p>
        </div>
    );

    if (loading) return <div className="text-center py-20 text-secondary">Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-primary">Dashboard Overview</h1>
                <p className="text-secondary mt-1">Welcome back, here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`Rp ${stats.revenue.toLocaleString('id-ID')}`}
                    icon={DollarSign}
                    trend={12.5}
                />
                <StatCard
                    title="Total Orders"
                    value={stats.orders}
                    icon={ShoppingBag}
                    trend={8.2}
                />
                <StatCard
                    title="Active Customers"
                    value={stats.customers}
                    icon={Users}
                    trend={-2.4}
                />
                <StatCard
                    title="Growth"
                    value="+24%"
                    icon={TrendingUp}
                    trend={4.5}
                />
            </div>

            {/* Charts & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart */}
                <div className="bg-surface rounded-2xl p-6 border border-white/5">
                    <h3 className="text-lg font-bold text-primary mb-6">Sales Analytics (7 Days)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00A3FF" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00A3FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '8px' }}
                                    itemStyle={{ color: '#00A3FF' }}
                                    labelStyle={{ color: '#cbd5e1' }}
                                    formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Sales']}
                                />
                                <Area type="monotone" dataKey="sales" stroke="#00A3FF" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Best Selling Products Chart - NEW */}
                <div className="bg-surface rounded-2xl p-6 border border-white/5">
                    <h3 className="text-lg font-bold text-primary mb-6">Top Products</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={true} vertical={false} />
                                <XAxis type="number" stroke="#94a3b8" hide />
                                <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" tick={{ fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '8px' }}
                                />
                                <Bar dataKey="quantity" fill="#00A3FF" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Orders List */}
                <div className="bg-surface border border-white/5 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-primary mb-6">Recent Orders</h2>
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 bg-background rounded-xl border border-white/5 hover:border-accent/50 transition-colors">
                                <div>
                                    <p className="text-sm font-bold text-primary">Order #{order.id.slice(0, 8)}</p>
                                    <p className="text-xs text-secondary">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-accent">Rp {(order.total || 0).toLocaleString('id-ID')}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                        order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                            'bg-blue-500/10 text-blue-500'
                                        }`}>
                                        {order.status || 'Pending'}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {recentOrders.length === 0 && (
                            <p className="text-center text-secondary py-4">No orders yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
