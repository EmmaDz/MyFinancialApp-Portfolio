import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import PortfolioPage from './pages/PortfolioPage';
import Questionaire from './pages/survey/Questionaire';
import Result from './pages/survey/Result';
import FinancialProductForm from './pages/financialProduct/FinancialProductForm';
import FinancialProductSearchPage from './pages/financialProduct/FinancialProductSearchPage';
import RecommendationPage from './pages/RecommendationPage';
import UserSelection from './pages/UserSelection';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <ToastContainer />
      <div className='app'>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/home' element={<Home />} />
          <Route path='/questionaire' element={<Questionaire />} />
          <Route path='/result' element={<Result />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/financialProductForm" element={<FinancialProductForm />} />
          <Route path="/financialProductSearch" element={<FinancialProductSearchPage />} />
          <Route path='/recommendations' element={<RecommendationPage />} />
          <Route path='/userSelection' element={<UserSelection />} />
          <Route path='/' element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
