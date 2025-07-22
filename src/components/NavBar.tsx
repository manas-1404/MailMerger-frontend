import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <header className="shadow sticky z-50 top-0">
            <nav className="bg-gray-900 border-gray-800 px-4 lg:px-6 py-2.5">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">

                    <Link to="/" className="flex items-center">
                        <div className="flex items-center justify-center bg-white rounded-full overflow-hidden h-14 w-24 mr-3">
                            <img
                                src="/mailstorm_logo.png"
                                className="object-contain h-15 w-40"
                                alt="MailStorm Logo"
                            />
                        </div>
                        <span className="text-white font-semibold text-lg hidden sm:block">
                            MailStorm
                        </span>
                    </Link>

                    <div
                        className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                        id="navbar-default"
                    >
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li>
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${
                                            isActive ? "text-blue-400" : "text-gray-300"
                                        } border-b border-gray-100 hover:bg-gray-800 lg:hover:bg-transparent lg:border-0 hover:text-blue-400 lg:p-0`
                                    }
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/write-email"
                                    className={({ isActive }) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${
                                            isActive ? "text-blue-400" : "text-gray-300"
                                        } border-b border-gray-100 hover:bg-gray-800 lg:hover:bg-transparent lg:border-0 hover:text-blue-400 lg:p-0`
                                    }
                                >
                                    Write Email
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/make-template"
                                    className={({ isActive }) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${
                                            isActive ? "text-blue-400" : "text-gray-300"
                                        } border-b border-gray-100 hover:bg-gray-800 lg:hover:bg-transparent lg:border-0 hover:text-blue-400 lg:p-0`
                                    }
                                >
                                    Create Template
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/upload-file"
                                    className={({ isActive }) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${
                                            isActive ? "text-blue-400" : "text-gray-300"
                                        } border-b border-gray-100 hover:bg-gray-800 lg:hover:bg-transparent lg:border-0 hover:text-blue-400 lg:p-0`
                                    }
                                >
                                    Upload Resume
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}
