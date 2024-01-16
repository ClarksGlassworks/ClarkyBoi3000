import Image from "next/image";
import Link from "next/link";
const Top8Friends = ({ products }) => {
	return (
		<div className="z-30  absolute   w-auto left-4 right-4  lg:w-[600px]   top-[20%] lg:top-[30px] lg:left-[30px]">
			<div className=" bg-white border-2 border-[#ca6707] w-full relative mt-[350px] lg:mt-auto mb-[200px]">
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
					/>
					<div className="text-blue-500 text-sm underline mt-2">Tom<br />Online</div>
				</div>

				{products.map((product, index) => {
                    const { name, image: {sourceUrl: src}, description, price, regularPrice, salePrice, slug } = product
					return (
                        <Link href={`/${product.slug}`} key={index}>
						<div className="bg-white col-span-1  flex flex-col items-center justify-center ">
							<Image
								alt="tom from mypsace"
								src={src}
								width={150}
								height={150}
								className="max-h-[150px] max-w-[120px]  border-2 object-fill border-[#ca6707] overflow-hidden"
							/>
							<div className="text-blue-500 text-sm underline mt-2 text-center line-clamp-1">
								{name}
							</div>
							<div className="flex flex-row items-center gap-2">
							<div className={`semibold  ${salePrice ? 'line-through text-red-500 text-xs opacity-50':'text-green-500 text-sm '}`}>{regularPrice}</div>
							{salePrice && <div className="text-sm semibold text-green-500">{salePrice}</div>}
							</div>
						</div>
                        </Link>
					);
				})}
			</div>
			<div className="border-t border-[#ca6707] p-2 mt-2 text-right text-blue-500 underline cursor-pointer"><Link href="/shop">View All of Clarks Friends</Link></div>
		</div>
		</div>
	);
};

export default Top8Friends;
