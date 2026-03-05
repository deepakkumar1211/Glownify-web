export const getCartKey = (userId) => `@user_cart_${userId}`;

export const getCart = (userId) => {
  const data = localStorage.getItem(getCartKey(userId));
  return data ? JSON.parse(data) : [];
};

export const removeFromCart = (userId, salonId, serviceId) => {
  let cart = getCart(userId);
  const salonIndex = cart.findIndex((item) => item.salonId === salonId);

  if (salonIndex > -1) {
    cart[salonIndex].services = cart[salonIndex].services.filter(
      (s) => s._id !== serviceId
    );
    if (cart[salonIndex].services.length === 0) {
      cart.splice(salonIndex, 1);
    }
  }

  localStorage.setItem(getCartKey(userId), JSON.stringify(cart));
  return cart;
};

export const addToCart = (userId, salon, service, selectedMode) => {
  let cart = getCart(userId);

  const salonIndex = cart.findIndex(
    (item) => item.salonId === salon._id
  );

  // Prepare the service object with the selected mode
  const serviceWithMode = {
    ...service,
    bookedMode: selectedMode // Store if this specific booking is for 'home' or 'salon'
  };

  console.log("Adding to cart:", { salon, service: serviceWithMode });

  if (salonIndex > -1) {
    const exists = cart[salonIndex].services.some(
      (s) => s._id === service._id
    );

    if (!exists) {
      cart[salonIndex].services.push(serviceWithMode);
    }
  } else {
    cart.push({
      salonId: salon._id,
      salonName: salon.shopName,
      // You can also store salon address/phone here if needed for checkout
      services: [serviceWithMode],
    });
  }

  localStorage.setItem(getCartKey(userId), JSON.stringify(cart));
  return cart;
};
