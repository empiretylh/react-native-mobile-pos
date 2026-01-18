/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
  useRef,
} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  RefreshControl,
  Button,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {STYLE as s, COLOR as C, ALERT as a} from '../../../Database';
import axios from 'axios';
import {numberWithCommas} from '../../../Database';
import PDITEM from './pditem';
import {CartContext} from '../context/CartContext';
import {ProductsContext} from '../context/ProductContext';
import BarCodeToCart from '../sales/AddWithBarCode';
import CartView from '../sales/EditCartList';
import {
  deleteCategories,
  deleteProducts,
  getAllCategories,
  getAllProducts,
  insertCategories,
  insertProduct,
} from '../../../localDatabase/products';
import {useNetInfo} from '@react-native-community/netinfo';
import EncryptedStorage from 'react-native-encrypted-storage';

const ProductField = ({
  ContainerProps,
  setTotalAmount,
  data,
  setData,
  custom = false,
}) => {
  const [open, setOpen] = useState(false);

  const [load, setLoad] = useState(false);

  const [ProductData, setProductData] = useState();
  const [categoryData, setCategoryData] = useState();
  const [productsCache, setProductsCache] = useState(null);
  const [categoriesCache, setCategoriesCache] = useState(null);

  const [searchtext, setSearchText] = useState('');
  const [categoryId, setCategoryId] = useState('All');
  const [editcartshow, seteditcartshow] = useState(false);
  const searchDebounceTimerRef = useRef(null);
  const [barcodeType, setBarcodeType] = useState('camera');

  const {CartData, setCartData} = useContext(CartContext);

  const {isConnected} = useNetInfo();

  // Load barcode type setting
  useEffect(() => {
    const loadBarcodeType = async () => {
      try {
        const settingData = await EncryptedStorage.getItem('setting_data');
        if (settingData) {
          const settings = JSON.parse(settingData);
          setBarcodeType(settings.barcode_type || 'camera');
        }
      } catch (err) {
        console.log('Error loading barcode type:', err);
      }
    };
    loadBarcodeType();
  }, []);

  const SetOpenModal = useCallback(() => {
    setOpen(true);
    // Reset search and category states when opening modal
    setSearchText('');
    setCategoryId('All');
    // Use cached data if available, otherwise fetch
    if (productsCache && categoriesCache) {
      setProductData(productsCache);
      setCategoryData(categoriesCache);
      // Still refresh in background if connected
      if (isConnected) {
        GetProdcutsFromServer();
        GetCategoryFromServer();
      }
    } else {
      GetProdcutsFromServer();
      GetCategoryFromServer();
    }
  }, [productsCache, categoriesCache, isConnected]);

  const GetProdcutsFromServer = async () => {
    setLoad(true);
    if (isConnected) {
      axios
        .get('/api/products/')
        .then(res => {
          deleteProducts();
          res.data.forEach(item => {
            insertProduct(
              item.id,
              item.name,
              item.price,
              item.cost,
              item.qty,
              item.date,

              item.description,
              item.category,
              item.pic,
              1,
              item.barcode,
            );
          });
          res.data = res.data.filter(e => e.qty > 0);
          setProductData(res.data);
          setProductsCache(res.data); // Cache the products

          setLoad(false);
        })
        .catch(() => {
          a.spe();
          setLoad(false);
          getProductFromLocal();
        });
    } else {
      getProductFromLocal();
      setLoad(false);

      // console.log('Result ::: ', result);
    }
  };
  const getProductFromLocal = async () => {
    let result = await getAllProducts();
    console.log('Product Result : ', result);
    result = result?.filter(item => item.qty > 0);
    setProductData(result);
    setProductsCache(result); // Cache the products
  };

  const getCategoryFromLocal = async () => {
    let result = await getAllCategories();
    console.log(result);
    let categories = [];
    result.forEach(item => {
      categories.push({label: item.title, value: item.id, id: item.id});
    });
    setCategoryData(categories);
    setCategoriesCache(categories); // Cache the categories from local storage
  };

  const GetCategoryFromServer = () => {
    if (!isConnected) {
      getCategoryFromLocal();
      // console.log('I need result : ', result);
      //setCategoryData(result);
      return;
    }

    axios
      .get('/api/categorys/')
      .then(res => {
        let categories = [];
        deleteCategories();
        res.data.forEach(item => {
          categories.push({label: item.title, value: item.id, id: item.id});
          insertCategories(item.id, item.title);
        });
        console.log(categories);
        setCategoryData(categories);
        setCategoriesCache(categories); // Cache the categories
      })
      .catch(err => {
        console.log('Error fetching categories:', err);
        getCategoryFromLocal();
      });
  };

  const ProductFilter = useMemo(() => {
    if (!ProductData) {
      return [];
    }
    if (!categoryId) {
      return ProductData;
    }

    const searchLower = searchtext.replaceAllTxt(' ', '').toLowerCase();

    // If no search text and category is "All", return all products
    if (!searchLower && categoryId === 'All') {
      return ProductData;
    }

    return ProductData.filter(e => {
      const nameLower = e?.name?.replaceAllTxt(' ', '').toLowerCase() || '';
      const barcode = e?.barcode?.toString() || '';

      // Check barcode match first (most specific)
      if (barcode.includes(searchLower)) {
        return true;
      }

      // Check category filter
      const matchesCategory = categoryId === 'All' || e.category === categoryId;

      // If no search text, just use category filter
      if (!searchLower) {
        return matchesCategory;
      }

      // Check name match with category filter
      return matchesCategory && nameLower.includes(searchLower);
    });
  }, [searchtext, ProductData, categoryId]);

  console.log('re render Products Field');

  const ProductDataValue = useMemo(() => ({ProductData}), [ProductData]);
  const [cpriceclick, setCPriceClick] = useState([]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceTimerRef.current) {
        clearTimeout(searchDebounceTimerRef.current);
      }
    };
  }, []);

  // Debounced search handler with proper cleanup
  const handleSearchTextChange = useCallback(text => {
    // Clear previous timer
    if (searchDebounceTimerRef.current) {
      clearTimeout(searchDebounceTimerRef.current);
    }

    // Set new timer for debounced search
    searchDebounceTimerRef.current = setTimeout(() => {
      setSearchText(text);
    }, 300); // 300ms debounce delay
  }, []);

  const changePrice = useCallback(id => {
    setCartData(prevCartData => {
      let temp = [...prevCartData];
      let index = temp.findIndex(e => e.name === id);

      if (index === -1) {
        return prevCartData;
      }

      // Use functional update to get current cpriceclick count
      setCPriceClick(prev => {
        let count = prev.filter(e => e === id).length;

        // Create new extraprice array immutably with safety check
        const currentExtraprice = temp[index].extraprice || [];
        const newExtraprice = [
          ...currentExtraprice,
          {extraprice: temp[index].price},
        ];

        let position = count % newExtraprice.length;
        let total = newExtraprice[position].extraprice * temp[index].qty;

        temp[index] = {
          ...temp[index],
          extraprice: newExtraprice,
          price: newExtraprice[position].extraprice,
          total: total,
        };

        return [...prev, id];
      });

      return temp;
    });
  }, []);

  const handleDone = useCallback(() => {
    setOpen(false);
    setData(CartData);
    // Reset states when closing
    setSearchText('');
    setCategoryId('All');
    if (searchDebounceTimerRef.current) {
      clearTimeout(searchDebounceTimerRef.current);
    }
  }, [CartData, setData]);

  const ListItem = ({item}) => {
    return (
      <View
        style={{
          padding: 5,
          backgroundColor: C.blackbutton,
          marginLeft: 5,
          borderRadius: 15,
        }}>
        <Text style={{fontWeight: 'bold', color: 'white'}}>{item.pdname}</Text>
      </View>
    );
  };

  return (
    <>
      <Modal visible={open}>
        <InternalProductView
          searchtext={searchtext}
          handleSearchTextChange={handleSearchTextChange}
          categoryData={categoryData}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          load={load}
          GetProdcutsFromServer={GetProdcutsFromServer}
          ProductFilter={ProductFilter}
          CartData={CartData}
          setTotalAmount={setTotalAmount}
          editcartshow={editcartshow}
          seteditcartshow={seteditcartshow}
          changePrice={changePrice}
          cpriceclick={cpriceclick}
          handleDone={handleDone}
          ProductDataValue={ProductDataValue}
          barcodeType={barcodeType}
        />
      </Modal>
      {custom ? (
        <TouchableOpacity
          style={{
            padding: 5,
            backgroundColor: C.bluecolor,
            borderRadius: 15,
            marginRight: 5,
          }}
          onPress={() => SetOpenModal()}>
          <Icon name={'add'} size={25} color={'#fff'} />
        </TouchableOpacity>
      ) : (
        <View {...ContainerProps}>
          <View style={{flex: 1}}>
            {CartData ? (
              <FlatList
                horizontal
                contentContainerStyle={{flexDirection: 'row'}}
                style={{backgroundColor: C.white}}
                data={CartData}
                renderItem={({item}) => <ListItem item={item} />}
                keyExtractor={i => i.name}
              />
            ) : (
              <TouchableOpacity
                style={{padding: 5}}
                onPress={() => SetOpenModal()}>
                <Text>Choose Products</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={{padding: 5}} onPress={() => SetOpenModal()}>
            <Icon name={'add'} size={20} color={'#000'} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

// Extract ProductView as a separate memoized component to prevent unnecessary re-renders
const InternalProductView = React.memo(
  ({
    searchtext,
    handleSearchTextChange,
    categoryData,
    categoryId,
    setCategoryId,
    load,
    GetProdcutsFromServer,
    ProductFilter,
    CartData,
    setTotalAmount,
    editcartshow,
    seteditcartshow,
    changePrice,
    cpriceclick,
    handleDone,
    ProductDataValue,
    barcodeType,
  }) => {
    const [openbarcode, setOpenBarcode] = useState(false);
    const [barcodeInput, setBarcodeInput] = useState('');
    const barcodeInputRef = useRef(null);
    const {setCartData} = useContext(CartContext);

    // Add product by barcode for keyboard scanner
    const addProductByBarcode = useCallback(
      barcode => {
        if (!barcode || !ProductDataValue.ProductData) {
          return;
        }

        const product = ProductDataValue.ProductData.find(
          item => item.barcode == barcode,
        );

        if (product) {
          const index = CartData.findIndex(e => e.name === product.id);
          let updatedCartData;

          if (index !== -1) {
            updatedCartData = [...CartData];
            updatedCartData[index].qty += 1;
            updatedCartData[index].total =
              updatedCartData[index].qty * updatedCartData[index].price;
          } else {
            const newItem = {
              name: product.id,
              qty: 1,
              price: product.price,
              check: true,
              total: product.price,
              pdname: product.name,
              extraprice: product.extraprice || [],
            };
            updatedCartData = [...CartData, newItem];
          }

          setCartData(updatedCartData);

          // Calculate total
          const newTotal = updatedCartData.reduce(
            (sum, item) => sum + parseInt(item.total, 10),
            0,
          );
          setTotalAmount(newTotal);

          // Clear input and refocus
          setBarcodeInput('');
          setTimeout(() => {
            barcodeInputRef.current?.focus();
          }, 100);
        } else {
          a.spe();
          setBarcodeInput('');
          setTimeout(() => {
            barcodeInputRef.current?.focus();
          }, 100);
        }
      },
      [ProductDataValue.ProductData, CartData, setCartData, setTotalAmount],
    );

    const SumTotal = useMemo(() => {
      console.log('here');
      if (CartData.length === 0) {
        return 0;
      }

      let amount = 0;
      CartData.forEach(e => {
        amount += parseInt(e.total, 10);
      });
      return amount;
    }, [CartData]);

    useEffect(() => {
      setTotalAmount(SumTotal);
    }, [SumTotal, setTotalAmount]);

    const CTITEM = ({item}) => {
      const labelstyle = {
        ...s.normal_label,
        color: 'black',
        flex: 1,
        padding: 2,
        textAlign: 'center',
        borderColor: 'black',
        borderWidth: 1,
      };
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <Text style={labelstyle}>{item.pdname}</Text>
          <Text style={labelstyle}>{item.qty}</Text>
          {item?.extraprice?.length > 0 ? (
            <TouchableOpacity
              style={labelstyle}
              onPress={() => changePrice(item.name)}>
              <Text style={labelstyle}>{numberWithCommas(item.price)}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={labelstyle}>{numberWithCommas(item.price)}</Text>
          )}
          <Text style={{...labelstyle, textAlign: 'right'}}>
            {numberWithCommas(item.total)}
          </Text>
        </View>
      );
    };

    return (
      <ProductsContext.Provider value={ProductDataValue}>
        <KeyboardAvoidingView style={{flex: 1, padding: 0}}>
          <View style={{flexDirection: 'column', padding: 5}}>
            <View
              style={{
                ...s.flexrow_aligncenter_j_between,
                borderRadius: 15,
                height: 45,
                borderColor: 'black',
                borderWidth: 1.5,
                paddingRight: 10,
                margin: 5,
              }}>
              <TextInput
                style={{
                  padding: 10,
                  flex: 1,
                  fontWeight: '900',
                }}
                placeholder={'Search Products'}
                onChangeText={e => handleSearchTextChange(e)}
              />
              <Icon name={'search'} size={20} color={'#000'} />
              {barcodeType === 'camera' ? (
                <TouchableOpacity onPress={() => setOpenBarcode(true)}>
                  <Icon
                    name={'barcode-outline'}
                    size={25}
                    color={'#000'}
                    style={{marginLeft: 10}}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            {/* Barcode Scanner Input for keyboard scanner */}
            {barcodeType === 'scanner' ? (
              <View
                style={{
                  ...s.flexrow_aligncenter_j_between,
                  borderRadius: 15,
                  height: 45,
                  borderColor: 'black',
                  borderWidth: 1.5,
                  paddingRight: 10,
                  margin: 5,
                  marginTop: 10,
                }}>
                <Icon
                  name={'barcode-outline'}
                  size={20}
                  color={'#000'}
                  style={{marginLeft: 10, marginRight: 10}}
                />
                <TextInput
                  ref={barcodeInputRef}
                  style={{
                    padding: 10,
                    flex: 1,
                    fontWeight: '900',
                  }}
                  placeholder={'Scan or enter barcode'}
                  value={barcodeInput}
                  onChangeText={e => setBarcodeInput(e)}
                  keyboardType="numeric"
                  returnKeyType="done"
                  onSubmitEditing={() => addProductByBarcode(barcodeInput)}
                  autoCorrect={false}
                />
                {barcodeInput ? (
                  <TouchableOpacity onPress={() => setBarcodeInput('')}>
                    <Icon name={'close-outline'} size={20} color={'#000'} />
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  onPress={() => addProductByBarcode(barcodeInput)}>
                  <Icon
                    name={'checkmark-circle-outline'}
                    size={20}
                    color={'green'}
                    style={{marginLeft: 10}}
                  />
                </TouchableOpacity>
              </View>
            ) : null}
            {/* Category View */}
            {categoryData ? (
              <ScrollView
                style={{
                  flexDirection: 'row',
                }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <TouchableOpacity onPress={e => setCategoryId('All')}>
                  <Text
                    style={{
                      backgroundColor:
                        categoryId === 'All' ? C.blackbutton : '#f0f0f0',
                      color: categoryId === 'All' ? 'white' : 'black',
                      padding: 10,
                      marginLeft: 5,
                      marginRight: 5,
                      borderRadius: 15,
                    }}>
                    All
                  </Text>
                </TouchableOpacity>
                {categoryData.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={e => setCategoryId(item.value)}>
                    <Text
                      style={{
                        backgroundColor:
                          categoryId === item.value ? C.blackbutton : '#f0f0f0',
                        color: categoryId === item.value ? 'white' : 'black',
                        padding: 10,
                        marginLeft: 5,
                        marginRight: 5,
                        borderRadius: 15,
                      }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : null}
          </View>
          <BarCodeToCart open={openbarcode} setOpen={setOpenBarcode} />

          {/* Product View */}
          <View style={{flex: 1}}>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={load}
                  onRefresh={GetProdcutsFromServer}
                />
              }
              initialNumToRender={10} // how many item to display first
              keyboardShouldPersistTaps={'always'}
              removeClippedSubviews={true}
              windowSize={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={50}
              style={{backgroundColor: C.white}}
              data={ProductFilter}
              renderItem={({item}) => <PDITEM item={item} />}
              keyExtractor={i => i.id}
            />
          </View>
          {/*Cart View */}
          <View
            style={{
              borderColor: 'black',
              borderRadius: 15,

              backgroundColor: 'yellow',
              borderWidth: 1,
              maxHeight: C.windowHeight * 30,
              padding: 5,
            }}>
            <CartView
              setTotalAmount={setTotalAmount}
              show={editcartshow}
              onClose={() => seteditcartshow(false)}
            />
            <View style={{...s.flexrow_aligncenter_j_between}}>
              <Text style={{...s.bold_label}}>Cart List</Text>
              <Text style={{...s.bold_label, fontSize: 15}}>
                {CartData.length} Items
              </Text>
              <TouchableOpacity
                style={{padding: 5}}
                onPress={() => seteditcartshow(true)}>
                <Icon name={'pencil'} size={20} color={'#000'} />
              </TouchableOpacity>
            </View>
            <FlatList
              contentContainerStyle={{flexDirection: 'column-reverse'}}
              style={{backgroundColor: C.white}}
              data={CartData}
              renderItem={({item}) => <CTITEM item={item} />}
              keyExtractor={i => i.name}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 5,
              }}>
              <Text style={{...s.bold_label}}>Total Amount :</Text>
              <Text style={{...s.bold_label}}>
                {numberWithCommas(SumTotal)} MMK
              </Text>
            </View>
            <Button title={'Done'} onPress={handleDone} />
            <TextInput
              style={{...s.textInputnormal}}
              keyboardType={'number-pad'}
            />
          </View>
        </KeyboardAvoidingView>
      </ProductsContext.Provider>
    );
  },
);

export default ProductField;
