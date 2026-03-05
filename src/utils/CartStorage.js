export const getCartKey = (userId) => `@user_cart_${userId}`;

export const getCart = (userId) => {
  const data = localStorage.getItem(getCartKey(userId));
  return data ? JSON.parse(data) : [];
};

export const removeFromCart = (userId, salonId, serviceId, bookedMode) => {
  let cart = getCart(userId);
  const salonIndex = cart.findIndex((item) => item.salonId === salonId);

  if (salonIndex > -1) {
    cart[salonIndex].services = cart[salonIndex].services.filter(
      (s) => !(s._id === serviceId && (bookedMode ? s.bookedMode === bookedMode : true))
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
      (s) => s._id === service._id && s.bookedMode === selectedMode
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
/**
 * updateServiceMode
 * Changes the bookedMode of an existing cart service without removing it.
 * Called when the user switches the toggle after a service is already in cart.
 */
export const updateServiceMode = (userId, salonId, serviceId, newMode) => {
  let cart = getCart(userId);
  const salonIndex = cart.findIndex((item) => item.salonId === salonId);

  if (salonIndex > -1) {
    const serviceIndex = cart[salonIndex].services.findIndex(
      (s) => s._id === serviceId
    );
    if (serviceIndex > -1) {
      cart[salonIndex].services[serviceIndex].bookedMode = newMode;
    }
  }

  localStorage.setItem(getCartKey(userId), JSON.stringify(cart));
  return cart;
};
