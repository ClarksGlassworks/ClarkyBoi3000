import Image from "next/image";
import Link from "next/link";
const Top8Friends = ({ products }) => {
	return (
		<div className="z-30 fixed left-[8%] right-[8%] top-[40%] lg:top-10  w-auto  lg:w-[600px] p-2 border-2 border-[#ca6707] bg-white ">
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
					<div className="text-blue-500 text-sm underline mt-2">Tom</div>
				</div>

				{products.map((product, index) => {
                    console.log({product})
                    const { name, image: {sourceUrl: src}, description, price, slug } = product
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
						</div>
                        </Link>
					);
				})}
			</div>
		</div>
	);
};

export default Top8Friends;
