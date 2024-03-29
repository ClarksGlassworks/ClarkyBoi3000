import Image from "next/image";
import Link from "next/link";
const Top8Friends = ({ products, scrollPosition }) => {
	return (
        <div className="z-30     w-auto   lg:max-w-[800px] bg-gray-200 -mt-[50px] lg:mt-[160px] mx-4 lg:mx-auto lg:ml-[50%] lg:-translate-x-1/2">
			<div className=" bg-white border-2 border-[#ca6707] w-full relative mt-[270px] lg:mt-auto">
			<div className="w-full  bg-[#fdd5a8] text-[#ca6707] p-2">
				Clark's Top 8 Friends
			</div>
			<div className="mt-2 grid grid-cols-2 lg:grid-cols-4 gap-2">
				<div className="bg-white col-span-1  flex flex-col items-center justify-center ">
					<Image
                        alt="tom from mypsace"
                        src="https://wp.clarksglassworks.com/wp-content/uploads/2024/01/tom_from_myspace_snl-e1705079509242.jpeg"
                        width={150}
                        height={150}
                        className="max-h-[150px] max-w-[120px]  border-2 object-fill border-[#ca6707] overflow-hidden"
                        style={{
                            maxWidth: "100%",
                            height: "auto"
                        }} />
					<div className="text-blue-500 text-sm  mt-2 text-center"><span className="underline">Tom</span><br /><span className="text-gray-200 no-underline">Offline</span></div>
				</div>

				{products.map((product, index) => {
                    const { name, image: {sourceUrl: src}, description, price, regularPrice, salePrice, slug } = product
					return (
                        <a href={`/${product.slug}`} key={index}>
						<div className="bg-white col-span-1  flex flex-col items-center justify-center ">
							<Image
                                alt="tom from mypsace"
                                src={src}
                                width={150}
                                height={150}
                                className="max-h-[150px] max-w-[120px]  border-2 object-fill border-[#ca6707] overflow-hidden"
                                style={{
                                    maxWidth: "100%",
                                    height: "auto"
                                }} />
							<div className="text-blue-500 text-sm underline mt-2 text-center line-clamp-1">
								{name}
							</div>
							<div className="flex flex-row items-center gap-2">
							<div className={`semibold  ${salePrice ? 'line-through text-red-500 text-xs opacity-50':'text-green-500 text-sm '}`}>{regularPrice}</div>
							{salePrice && <div className="text-sm semibold text-green-500">{salePrice}</div>}
							</div>
						</div>
                        </a>
                    );
				})}
			</div>
			<div className="border-t border-[#ca6707] p-2 mt-2 text-right text-blue-500 underline cursor-pointer"><a href="/shop">View All of Clarks Friends</a></div>
		</div>
		</div>
    );
};

export default Top8Friends;
