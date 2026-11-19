import Navbar from "../components/Navbar";
import ExpenseList from "../components/ExpenseList";

function Homepage(){
    const expenses=[
  {
    amount: "₹2,000",
    shopping: "Grocery Shopping",
    date: "17 Nov 2026",
    category: "Food"
  },
  {
    amount: "₹1,500",
    shopping: "Clothing Shopping",
    date: "16 Nov 2026",
    category: "Shopping"
  },
  {
    amount: "₹800",
    shopping: "Vegetable Shopping",
    date: "15 Nov 2026",
    category: "Food"
  },
]

    return(
        <>
             <Navbar/>
            <ExpenseList expenses={expenses}/>
                 
        </>
        );
}
export default Homepage;