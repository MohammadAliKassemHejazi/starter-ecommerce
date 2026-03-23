with open('client/src/store/slices/vendorDashboardSlice.ts', 'r') as f:
    content = f.read()

# Update salesData to match the backend: { totalSales: number, monthlySales: { month: string, totalAmount: number }[] }
content = content.replace("salesData: { date: string; totalSales: number }[];", "salesData: { totalSales: number, monthlySales: { month: string, totalAmount: number }[] } | null;")
content = content.replace("salesData: [],", "salesData: null,")

with open('client/src/store/slices/vendorDashboardSlice.ts', 'w') as f:
    f.write(content)
