import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface EarningsBreakdownProps {
  data: {
    income: { name: string; value: number; color: string }[];
    expenses: { category: string; amount: number; percentage: number }[];
  };
  propertyId?: string;
}

export default function EarningsBreakdown({ data: earningsData, propertyId }: EarningsBreakdownProps) {
  const data = earningsData.income;
  const expenses = earningsData.expenses;

  const totalIncome = data.reduce((sum, item) => sum + item.value, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const netIncome = totalIncome - totalExpenses;

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            💵 Income Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `TSh ${value.toLocaleString()}`}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {data.map((item) => (
              <div key={item.name} className="flex justify-between text-xs sm:text-sm p-2 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="font-medium whitespace-nowrap ml-2">TSh {item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            💸 Expenses & Net Income
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="space-y-4">
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div key={expense.category}>
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span className="font-medium">{expense.category}</span>
                    <span className="text-muted-foreground">
                      TSh {expense.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-400 to-red-500 h-2 rounded-full transition-all"
                      style={{ width: `${expense.percentage * 5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Total Income</span>
                <span className="font-bold text-green-600">
                  TSh {totalIncome.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Total Expenses</span>
                <span className="font-bold text-red-600">
                  TSh {totalExpenses.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-base sm:text-lg font-bold pt-2 border-t">
                <span>Net Income</span>
                <span className="text-green-600">
                  TSh {netIncome.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
