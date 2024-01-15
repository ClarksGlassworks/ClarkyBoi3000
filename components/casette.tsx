import Image from 'next/image';
const Casette = () => {
	return (
		<div className="z-30 fixed bottom-auto lg:bottom-10 top-24 lg:top-auto left-6 lg:left-20 animate-float">
			<Image
				src="https://wp.clarksglassworks.com/wp-content/uploads/2023/12/clark-tape.png"
				alt="Clark Tape"
				width={500}
				height={300}
				className="z-30 cursor-pointer scale-100 lg:scale-75"
			/>
		</div>
	);
};

export default Casette;
