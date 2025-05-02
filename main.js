
const menu = document.getElementById("menu");
let totalQuantity = 0;
let totalPrice = 0;

function updateTotalQuantity() {
   if (totalQuantity == 0) {
      document.querySelector("aside section").style.display = "block";
      document.getElementById("confirem").style.display = "none";
   };

   document.querySelector("h2").innerHTML = `Your Cart (${totalQuantity})`;
   document.querySelectorAll("div > strong").forEach((element) => {
      element.innerHTML = `$${totalPrice.toFixed(2)}`;
   });
}

async function fetchData() {
   try {
      const res = await fetch("./data.json");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const isMobile = window.matchMedia("(max-width: 430px)").matches;
      data.forEach((e) => {
         const itemsContainer = document.querySelector(".menu-items");
         const item = document.createElement("div");
         const category = document.createElement("span");
         const name = document.createElement("p");
         const price = document.createElement("data");
         const imgContainer = document.createElement("div");
         const menuBtn = document.createElement("button");
         const img = document.createElement("img");
         imgContainer.append(img, menuBtn);
         itemsContainer.appendChild(item)
         img.src = isMobile ? e.image.mobile : e.image.desktop;
         img.alt = e.name;
         category.setAttribute("class", "menu-category");
         name.setAttribute("class", "menu-name");
         price.setAttribute("class", "menu-price");

         
         // Items quantity
         let quantity = 0;

         // appending items in aside 
         function asideItem() {
            document.querySelector("aside section").style.display = "none";
            document.getElementById("confirem").style.display = "flex";

            const header = document.createElement("h4");
            const span = document.createElement("span");
            const p = document.createElement("p");
            const asideTotalPrice = document.createElement("data");
            const removeBtn = document.createElement("button");
            const dataContainer = document.createElement("data");
            const line = document.createElement("hr");
            dataContainer.setAttribute("id", e.category);
            removeBtn.setAttribute("class", "item-remove");
            asideTotalPrice.setAttribute("class", "total-price");


            document.querySelector("aside div").append(dataContainer, line);

            dataContainer.append(header, span, p, asideTotalPrice, removeBtn);
            header.innerHTML = `${e.name}<br>`;
            span.innerHTML = `${quantity}x`;
            p.innerHTML = `$${e.price.toFixed(2)}`;
            asideTotalPrice.innerHTML = `$${e.price.toFixed(2)}`;
            removeBtn.innerHTML = "X";

            removeBtn.addEventListener("click", () => {
               console.log();
               totalQuantity -= quantity;
               totalPrice -= e.price * quantity;
               quantity = 0;
               renderButtonUi();
               updateTotalQuantity();
               removeAsideItem();
            })
         };

         // appending items to popup confiremtion 
         function popupItem() {
            const icon = document.createElement("img");
            const header = document.createElement("h4");
            const itemPrice = document.createElement("data");
            const totalPrice = document.createElement("data");
            const itemQuantity = document.createElement("data");
            const dataContainer = document.createElement("div");
            const line = document.createElement("hr");
            itemPrice.setAttribute("class", "price");
            totalPrice.setAttribute("class", "total-price");
            itemQuantity.setAttribute("class", "quantity");
            dataContainer.setAttribute("class", e.category);

            const itemList = document.getElementById("item-list");
            const orderTotal = itemList.querySelector("div");

            itemList.insertBefore(dataContainer, orderTotal);
            itemList.insertBefore(line, orderTotal);
            
            icon.src = e.image.thumbnail;
            header.innerHTML = e.name;
            itemPrice.innerHTML = `$${e.price.toFixed(2)}`;
            totalPrice.innerHTML = `$${e.price.toFixed(2)}`;
            itemQuantity.innerHTML = `${quantity}x`;
            
            dataContainer.append(icon, header, itemPrice, totalPrice, itemQuantity);  
         };

         // decremet total price of the aside items
         function updateTotalPrice() {
            // Aside items
            document.getElementById(e.category).querySelector("data").innerHTML = `$${(e.price * quantity).toFixed(2)}`;
            document.getElementById(e.category).querySelector("span").innerHTML = `${quantity}x`;

            // Confirem items
            document.getElementsByClassName(e.category)[0].querySelector(".total-price").innerHTML = `$${(e.price * quantity).toFixed(2)}`;
            document.getElementsByClassName(e.category)[0].querySelector(".quantity").innerHTML = `${quantity}x`;

         };

         // Removing aside Items
         function removeAsideItem() {
            document.getElementById(e.category).nextElementSibling.remove();
            document.getElementById(e.category).remove();
            document.getElementsByClassName(e.category)[0].nextElementSibling.remove();
            document.getElementsByClassName(e.category)[0].remove();
         };

         // Menu Button 
         item.append(imgContainer, category, name, price);
         let btnCart = `<img src="/assets/images/icon-add-to-cart.svg" alt="Add to cart"> <span>Add to cart</span>`;
         menuBtn.setAttribute("class", "btn");
         menuBtn.classList.add("hover");
         menuBtn.innerHTML = btnCart;
         menuBtn.addEventListener("click", () => {
            if (quantity == 0) {
               quantity++;
               totalQuantity++;
               totalPrice += e.price;
               asideItem();
               updateTotalQuantity();
               renderButtonUi();
               popupItem();
            };
         });

         function renderButtonUi() {
            if (quantity >= 1) {
               menuBtn.innerHTML = `
               <img src="assets/images/icon-decrement-quantity.svg" class="btn-img" id="decrement" alt="decrement quantity">
               <span>${quantity}</span>
               <img src="assets/images/icon-increment-quantity.svg" class="btn-img" id="increment" alt="increment quantity">`;
               menuBtn.classList.add("active");
               menuBtn.classList.remove("hover");

               const decrementBtn = menuBtn.querySelector("#decrement");
               const incrementBtn = menuBtn.querySelector("#increment");

               decrementBtn.addEventListener("click", decrement);
               incrementBtn.addEventListener("click", increment);
               img.setAttribute("class", "selected-item");
            } else {
               menuBtn.innerHTML = btnCart;
               menuBtn.classList.add("hover");
               menuBtn.classList.remove("active");
               img.classList.remove("selected-item");
            };
         };

         function decrement(event) {
            event.stopPropagation();
            if (quantity == 1) {
               console.log("helo")
               quantity--;
               totalQuantity--;
               totalPrice -= e.price;
               removeAsideItem();
               renderButtonUi();
               updateTotalQuantity();
            } else if (quantity > 0) {
               console.log("helo");
               quantity--;
               totalQuantity--;
               totalPrice -= e.price;
               renderButtonUi();
               updateTotalPrice();
               updateTotalQuantity();
            }
         };

         function increment() {
            quantity++;
            totalQuantity++;
            totalPrice += e.price;
            renderButtonUi();
            updateTotalPrice();
            updateTotalQuantity();
         };

         renderButtonUi();

         
         menu.appendChild(itemsContainer);

         category.innerHTML = e.category;
         name.innerHTML = e.name;
         price.innerHTML = `$${e.price.toFixed(2)}`;});

         document.querySelector("#confirem button").addEventListener("click", () => {
            document.getElementById("popupOverlay").style.display = "flex";
         });
   } catch (err) {
      console.log(`fetch error: `, err.message);
   }
}
fetchData();

document.querySelector(".popup-box button").addEventListener("click", () => {
   location.reload();
});



