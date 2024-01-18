import Image from "next/image";
import ShoppingCartButton from "./shoppingCartButton";
const Corner = () => {
  return (
    <div className="fixed top-0 right-0">
      <Image
        src="https://wp.clarksglassworks.com/wp-content/uploads/2023/12/corner-leopard.png"
        alt="Corner Leopard"
        width={500}
        height={300}
        className="z-20 "
      />
      <ShoppingCartButton/>
    </div>
  );
}

export default Corner;
