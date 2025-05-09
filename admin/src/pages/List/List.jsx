import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = 'https://admin-92vt.onrender.com'; // Replace with your API base URL
  const currency = 'Rs.'; // Define your currency symbol here

  // Fetch the list of food items from the API
  const fetchList = async () => {
    setLoading(true); // Set loading state before the request
    try {
      const response = await axios.get(`${url}/api/food/list`);
      console.log("Fetched list:", response.data);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching food list");
      }
    } catch (error) {
      toast.error("An error occurred while fetching data");
      console.error('Error:', error);
    } finally {
      setLoading(false); // Set loading state after the request is complete
    }
  };

  // Remove a food item by its ID
  const removeFood = async (foodId) => {
    try {
      const response = await axios.delete(`${url}/api/food/remove/${foodId}`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList(); // Refresh the list after removing the item
      } else {
        toast.error("Error removing food");
      }
    } catch (error) {
      toast.error("An error occurred while removing food");
      console.error('Error:', error);
    }
  };

  // Fetch the food list when the component mounts
  useEffect(() => {
    fetchList();
  }, []); // Empty dependency array ensures this runs only once after mount

  return (
    <div className='list_add_flex-col'>
      <p>All Foods List</p>
      <div className='list-table'>
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          list.map((item, index) => {
            const imageUrl = `${url}/uploads/` + item.image; // Construct the image URL
            return (
              <div key={index} className='list-table-format'>
                <img src={imageUrl} alt={item.name} />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>{currency} {item.price}</p>
                <p className='cursor' onClick={() => removeFood(item._id)}>x</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default List;
