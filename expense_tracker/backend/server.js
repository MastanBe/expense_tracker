const express = require('express');
const cors = require('cors');
const { connect, sequelize } = require('./config/db'); 
const User = require('./models/User');
const MonthlyBudget = require('./models/MonthlyBudget');
const Category = require('./models/Category');
const CategoryWiseBudget = require('./models/CategoryWiseBudget'); 
const Expense = require('./models/Expense');
const userRoutes = require('./routes/userRoutes');
const monthlyBudgetRoutes = require('./routes/monthlyBudgetRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const categoryWiseBudgetRoutes = require('./routes/categoryWiseBudgetRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const reportRoutes=require('./routes/ReportRoute')
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.urlencoded({extended:true}))
app.use(express.json()); 
connect();


User.associate({ MonthlyBudget, Category, Expense, CategoryWiseBudget }); 
MonthlyBudget.associate({ User, CategoryWiseBudget, Expense });
Category.associate({ User, Expense, CategoryWiseBudget });
CategoryWiseBudget.associate({ MonthlyBudget, Category, User }); 
Expense.associate({ User, Category, MonthlyBudget });

app.use('/api/users', userRoutes);
app.use('/api/monthly-budgets', monthlyBudgetRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/category-wise-budgets', categoryWiseBudgetRoutes);
app.use('/api/expenses',expenseRoutes);
app.use('/api/report',reportRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Budget Management API!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
