import { BrowserRouter } from 'react-router-dom';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';
import { store } from './context/store';
import { Provider } from 'react-redux';
import { ModalProvider } from './components/AnimatedModal';
export default function App() {
	return (
		<Provider store={store}>
			<BrowserRouter>
				<ModalProvider>
					<div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
						<Navbar />
						<main className="relative flex-grow w-full bg-gray-800">
							<div>
								<AppRoutes />
							</div>
						</main>
						<Footer />
					</div>
				</ModalProvider>
			</BrowserRouter>
		</Provider>
	);
}
