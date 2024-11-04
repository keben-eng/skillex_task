import Link from 'next/link';

const Welcome = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-blue-900 to-blue-800">
            <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-8 text-center max-w-md">
                <h2 className="text-2xl font-extrabold mb-4 text-gray-800">Welcome to My Mini Project!</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Hello there! Please click on get started to load the main page, please note that I am a solo-learn developer and hopefully this mini task will be appreciated🙋🏻‍♂️
                </p>
                <Link href="/main">
                    <button className="px-6 py-3 bg-blue-900 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300 transform hover:scale-105">
                        Get Started
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Welcome;
