import { BrowserRouter } from 'react-router-dom';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import Navbar from './screens/Navbar';
import { store } from './context/store';
import { Provider } from 'react-redux';

export default function App() {
	return (
		<Provider store={store}>
			<BrowserRouter>
				<div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
					<Navbar />
					<main className="relative h-full w-full">
						<div>
							<AppRoutes />
						</div>
					</main>
					<Footer />
				</div>
			</BrowserRouter>
		</Provider>
	);
}
