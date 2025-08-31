import { BrowserRouter } from 'react-router-dom';
import Footer from './components/Footer';
import AppRouter from './routes/AppRouter';
import Navbar from './components/Navbar';
import { store } from './context/store';
import { Provider } from 'react-redux';
import './index.css'
export default function App() {
	return (
		<Provider store={store}>
			<BrowserRouter>
				<div className="relative flex flex-col items-center justify-center bg-[#000] text-white">
					<Navbar />
					<main className="relative flex-grow w-full">
						<AppRouter />
					</main>
					<Footer />
				</div>
			</BrowserRouter>
		</Provider>
	);
}
