/* Wishlist page. */
(function () {
  UI.mount();
  const root = document.getElementById("wishRoot");
  const moveAll = document.getElementById("moveAll");

  function render() {
    const ids = Store.getWishlist();
    const list = ids.map(Store.getProduct).filter(Boolean);
    if (!list.length) {
      moveAll.style.display = "none";
      root.innerHTML = `<div class="empty-state"><div class="ico">${UI.ic("heart")}</div><h2>${t("wish.empty")}</h2>
        <a class="btn btn-primary btn-lg" href="products.html" style="margin-top:16px">${t("cta.continue")}</a></div>`;
      return;
    }
    moveAll.style.display = "";
    root.innerHTML = UI.cardGrid(list);
    UI.revealOnScroll(root);
  }

  moveAll.onclick = () => {
    Store.getWishlist().forEach(id => Store.addToCart(id));
    UI.toast(t("toast.addedCart"));
  };

  render();
  Store.on("wishlist", render);
})();
