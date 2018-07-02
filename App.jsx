import React from 'react';
import ReactDOM from 'react-dom';
import WorldMap from '../images/worldHigh.svg';

class App extends React.Component {


    constructor(props){
        super(props);
        this.state = {
            info: null,
            mortality: '',
            country: null,
            yourAge: '',
            sex: 'male'

        }
    }

    handleChoseCountry = (e) => {
        document.querySelectorAll('path').forEach( p => p.classList.remove("highlight") );
        e.target.classList.add("highlight");
        this.setState({
            country: e.target.dataset.title
        })

    }

    handleFetchCountry = (e) => {
        e.preventDefault();

        let country = this.state.country;
        let sex = this.state.sex;
        let age = this.state.yourAge;

        if(age.indexOf('y') == -1){
            alert('Błędny format wieku - tak wygląda poprawny 35y')
        }

        fetch('http://api.population.io:80/1.0/mortality-distribution/'+country+'/'+sex+'/'+age+'/today/')
            .then( resp => {
                if (resp.ok){
                    return resp.json()
                }else{
                    throw new Error('Network problems');
                }
            })
            .then( data => {
                data = data.mortality_distribution[0];
                console.log(data);
                //setState for info
                let info = 'You have '+data['mortality_percent']+' percent chance to die at age '+data.age;
                console.log(info);
                this.setState({
                    // mortality: data.mortality_percentage,
                    info:  info
                })
            })
            .catch( e => console.log('ERROR '+e.message))



    }


    handleChangeAge = (e) => {
        this.setState({
            yourAge: e.target.value

        })
    }

    handleChangeCountry = (e) => {
        this.setState({
            country: this.handleChoseCountry

        })
    }

    handleChangeSex = (e) => {
        this.setState({
            sex: e.target.value

        })
    }


    render() {

        let infoView = null;
        if(this.state.info){
            infoView =
                <h1>

                    {this.state.info}
                    </h1>
        }

        return (
            <section>
                <h1>Mortality distribution</h1>
                {infoView}
                <form onSubmit={this.handleFetchCountry}>
                    <label>
                        Country:
                        <input type="text" name="country" placeholder="Poland" value={this.state.country}/>
                    </label>
                    <label>
                        Age:
                        <input type="text" name="age" placeholder="35y" onChange={this.handleChangeAge} value={this.state.yourAge}/>
                    </label>
                    <label>
                        Sex:
                        <select value={this.state.sex} onChange={this.handleChangeSex}>
                            <option value="male">male</option>
                            <option value="female">female</option>
                        </select>
                    </label>
                    <label>---->
                        <button onClick={this.handleFetchCountry}>Check Mortality</button>
                    </label>
                </form>
                <WorldMap className="map" onClick={this.handleChoseCountry}/>

            </section>
        );
    }

}

document.addEventListener('DOMContentLoaded', function () {
    ReactDOM.render(
        <App/>,
        document.getElementById('app')
    )
})


// po wybraniu kraju i wieku podkresli sie dany kraj
// podpiac event na przycisk ktory bedzie generowal dane
// zaimportwoac dane z zew api za pomoca fetch
// dodatkowo poniżej zostanie wypisany wspolczynnik smiertelnosci
