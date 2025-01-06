import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './Footer';

const Facilities = () => {
  const [facilitiesByCategory, setFacilitiesByCategory] = useState({});
  const [error, setError] = useState(null);
  const [openCategory, setOpenCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get('http://localhost:5000/api/facilities')
      .then((response) => {
        const facilities = response.data;
        const groupedFacilities = facilities.reduce((grouped, facility) => {
          const categoryName = facility.category_name;
          if (!grouped[categoryName]) {
            grouped[categoryName] = [];
          }
          grouped[categoryName].push(facility);
          return grouped;
        }, {});
        setFacilitiesByCategory(groupedFacilities);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching facilities.');
        setIsLoading(false);
      });
  }, []);

  const toggleCategory = (categoryName) => {
    setOpenCategory(openCategory === categoryName ? null : categoryName);
  };

  return (
    <div className="container mx-auto px-4 py-10 mt-10">
      <motion.img
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        src="/assets/sample.jpeg"
        alt="Facilities Header"
        className="w-full h-64 object-cover rounded-lg mb-8"
      />
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl font-bold text-gray-800 mb-6"
      >
        Facilities
      </motion.h2>
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
        >
          {error}
        </motion.p>
      )}
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex justify-center items-center h-64"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
        </motion.div>
      ) : Object.keys(facilitiesByCategory).length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4"
        >
          {Object.entries(facilitiesByCategory).map(([categoryName, facilities]) => (
            <motion.div
              key={categoryName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition duration-150 ease-in-out"
                onClick={() => toggleCategory(categoryName)}
              >
                <h3 className="text-xl font-semibold text-gray-700">{categoryName}</h3>
                <motion.div
                  animate={{ rotate: openCategory === categoryName ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openCategory === categoryName && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-white"
                  >
                    <p className="text-gray-600 mb-4">{facilities[0].category_description}</p>
                    <ul className="space-y-2">
                      {facilities.map((facility, index) => (
                        <motion.li
                          key={facility.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200"
                        >
                          <Link
                            to={`/facility/${facility.id}`}
                            className="block p-4 hover:bg-gray-50 transition duration-150 ease-in-out"
                          >
                            <h4 className="text-lg font-medium text-gray-800 mb-2">{facility.name}</h4>
                            <p className="text-gray-600 text-sm">{facility.description}</p>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-gray-600"
        >
          No facilities available.
        </motion.p>
      )}

      <Footer />
    </div>
  );
};

export default Facilities;

