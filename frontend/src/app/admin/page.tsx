export default function AdminOverview() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-card rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Sales</h3>
                    <p className="text-2xl font-bold mt-2">$24,932</p>
                </div>
                <div className="p-6 bg-card rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Active Orders</h3>
                    <p className="text-2xl font-bold mt-2">14</p>
                </div>
                <div className="p-6 bg-card rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Products</h3>
                    <p className="text-2xl font-bold mt-2">43</p>
                </div>
            </div>
        </div>
    )
}
