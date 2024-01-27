import Image from "next/image";
import Link from "next/link";
const HomepageMenu = () => {
	return (
		<div className="z-30 w-auto  lg:w-[600px] lg:top-[160px] mt-[30px] h-[300px] bg-gradient-to-b from-transparent to-black border-t-4 border-white backdrop-blur-sm ">
		<div className=" w-full relative lg:mt-auto h-full">
	
		<div className="p-8 pb-0 text-[60px] text-white font-honk text-center">MENU



</div>
				<ul className="p-8 pt-0 rounded-lg">
				<li className="text-white text-[30px] font-vt323 underline">Shop</li>

				<li className="text-white text-[30px] font-vt323 underline">Wholesale</li>
				<li className="text-white text-[30px] font-vt323 underline">Customs</li>
				<li className="text-white text-[30px] font-vt323 underline">Contact</li>

				</ul>
		
			{/* <div className="border-t border-[#ca6707] p-2 mt-2 text-right text-blue-500 underline cursor-pointer"><Link href="/shop">View All of Clarks Friends</Link></div> */}
		</div>
		</div>
	);
};

export default HomepageMenu;
