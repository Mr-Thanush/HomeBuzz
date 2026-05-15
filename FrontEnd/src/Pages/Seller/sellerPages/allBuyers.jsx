import Navbar from '../../../Components/navBar';
import PageTitle from "../../../Components/pageTitle";

export default function AllBuyers() {
  return (
    <>
    <Navbar/>
    <PageTitle title="Seller All Buyers"/>
    <section className="seller-page">
      <h1>All Buyers</h1>

      <div className="seller-card">
        <p><b>Name:</b> Rahul Sharma</p>
        <p><b>Email:</b> rahul@email.com</p>
      </div>
    </section>
    </>
  );
}