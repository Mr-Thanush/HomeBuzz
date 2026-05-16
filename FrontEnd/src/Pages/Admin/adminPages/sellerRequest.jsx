import Navbar from "../../../Components/navBar";
import PageTitle from "../../../Components/pageTitle";



export default function SellerRequests() {
  return (
    <>
    <Navbar/>
    <PageTitle title="Admin Seller Request"/>
   
    <section className="admin-page2">
      <h1>Seller Requests</h1>

      <div className="admin-table">
        <div className="admin-row">
          <span>Vikram Electronics</span>
          <span className="badge pending">Pending</span>
          <button className="success">Approve</button>
          <button className="danger">Reject</button>
        </div>
      </div>
    </section>
     </>
  );
}