import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserProvider";
// import { BillsContext } from "../context/BillsProvider";
import { useParams, useHistory } from 'react-router-dom';
import Popup from "./Popup.js"

function ItemEntry({ item, preTaxTotal, taxAndTipAmount, billItems, setBillItems, currencyFormatter, bill}) {

  // let { bills, setBills } = useContext(BillsContext)

  console.log(bill.creator_id)

  let { user } = useContext(UserContext);

  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false)
  const [users, setUsers] = useState([]);
  const [usersId, setUsersId] = useState(item.user_id);
  const [itemNote, setItemNote] = useState(item.item_note);
  const [itemAmount, setItemAmount] = useState(item.item_amount);
  const [settled, setSettled] = useState(item.settled)
  let history = useHistory();

  const togglePopup = () => {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    fetch("/users")
        .then((r) => r.json())
        .then(data => setUsers(data));
    }, []);


  function handlesSubmitEditedItem(e){
    e.preventDefault();

    const itemData = {
      item_note: itemNote,
      item_amount: itemAmount,
      user_id: usersId,
      bill_id: id,
      settled: settled
    }

    fetch(`/items/${item.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(itemData)
    })
      .then((r) => r.json())
      .then((updatedItem) => console.log(updatedItem))

    item = itemData
    setIsOpen(false)
    alert("Item has been updated!");
  }

  function handleDeleteItem(e){
    fetch(`/items/${item.id}`,{
      method: "DELETE"
    })

    deleteItemFromPage()
    alert("Item has been removed from bill!");
  }

  function deleteItemFromPage() {
    const newBillItems = billItems.filter(billItem => {
      return billItem.id !== item.id
    })
    // console.log(newBillItems)
    setBillItems(newBillItems)
  }

  const amountOwed = ((item.item_amount / preTaxTotal) * taxAndTipAmount) + item.item_amount


  return (
    <section>
      ---------------------------
      <h3>{`${item.user.first_name} ${item.user.last_name}`}</h3>
      <h4>{item.item_note}</h4>
      <p>Paid? {item.settled ? "✅" : "🚫" }</p>
      <p>Item Amount: {currencyFormatter.format(item.item_amount)}</p>
      <p><span>Amount Owed </span> (includes tax & tip if applicable): {currencyFormatter.format(amountOwed)}</p>
      <a href={`http://venmo.com/u/${item.user.venmo_username}`}>Venmo</a>
      <br></br>

    {user.id == bill.creator_id ? (
              <input
              className="FormBtn"
              type="button"
              value="Edit Item"
              onClick={togglePopup}
            />
    ) : null}


      {isOpen && <Popup
        content={
          <>
            <form onSubmit={handlesSubmitEditedItem}>
            <h1 className="EditItemTitle">Edit Item</h1>
            <label className="EditFormLabel">User:</label>
                      <select
                          className="EditFormInput"
                          id="user_id"
                          name="user_id"
                          value={usersId}
                          onChange={(e) => setUsersId(e.target.value)}
                      >
                      <option value="">Select a User</option>
                          {users.map((user) => (
                              <option key={user.id} value={user.id}>
                                  {user.first_name} {user.last_name}
                              </option>
                          ))}
                      </select>
              <label className="EditFormLabel">Item Note: </label>
                <textarea
                className="EditFormInput"
                type="text"
                name="item_note"
                value={itemNote}
                onChange={(e) => setItemNote(e.target.value)}
                />

              <label className="EditFormLabel">Item Amount: </label>
                <input
                    className="EditFormInput"
                    type="number"
                    name="item_amount"
                    placeholder="$"
                    value={itemAmount}
                    onChange={(e) => setItemAmount(e.target.value)}
                />
              <label className="EditFormLabel">Paid? </label>
                <input
                    className="EditFormInput"
                    type="checkbox"
                    name="settled"
                    checked={settled}
                    onChange={(e) => setSettled(e.target.checked)}
                />
            <button className="FormBtn">Update Item</button>
            </form>
          </>
        }
      handleClose={togglePopup}
      />}
      <br></br>
      <br></br>

      { user.id == bill.creator_id ? (
        <>
          <button onClick={handleDeleteItem} className="DeleteBtn">Delete Item</button>
          <br></br>
        </>
      ) : null}

      ---------------------------
    </section>
  )
}

export default ItemEntry;