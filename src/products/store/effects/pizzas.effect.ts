import { Injectable } from "@angular/core";
import { Actions, Effect } from "@ngrx/effects";
import * as pizzaActions from '../actions/pizzas.action';
import { catchError, map, switchMap } from "rxjs/operators";
import * as fromServices from '../../services';
import { of } from "rxjs/observable/of";

@Injectable()
export class PizzasEffects {
  constructor(private actions$: Actions,
    private pizzaService: fromServices.PizzasService) {
  }

  @Effect()
  loadPizzas$ = this.actions$.ofType(pizzaActions.LOAD_PIZZAS).pipe(
    switchMap(() => {
      return this.pizzaService.getPizzas().pipe(
        map(pizzas => new pizzaActions.LoadPizzasSuccess(pizzas)),
        catchError(error => of(new pizzaActions.LoadPizzasFail(error)))
      );
    })
  );

  @Effect()
  createPizza$ = this.actions$.ofType(pizzaActions.CREATE_PIZZA).pipe(
    map((action: pizzaActions.CreatePizza) => action.payload),
    switchMap(pizza => {
      return this.pizzaService.createPizza(pizza).pipe(
        map(pizza => new pizzaActions.CreatePizzaSuccess(pizza)),
        catchError(error => of(new pizzaActions.CreatePizzaFail(error)))
      );
    })
  )

  @Effect()
  updatePizza$ = this.actions$.ofType(pizzaActions.UPDATE_PIZZA).pipe(
    map((action: pizzaActions.UpdatePizza) => action.payload),
    switchMap((pizza) => this.pizzaService.updatePizza(pizza).pipe(
      map(pizza => new pizzaActions.UpdatePizzaSuccess(pizza)),
      catchError(error => of(new pizzaActions.UpdatePizzaFail(error)))
    ))
  )

  @Effect()
  removePizza$ = this.actions$.ofType(pizzaActions.DELETE_PIZZA).pipe(
    map((action: pizzaActions.DeletePizza) => action.payload),
    switchMap((pizza) => this.pizzaService.removePizza(pizza).pipe(
      map(() => new pizzaActions.DeletePizzaSuccess(pizza)),
      catchError(error => of(new pizzaActions.DeletePizzaFail(error)))
    ))
  )

}
